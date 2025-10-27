package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.hihn.ampd.server.util.StringUtils.isNullOrEmpty;

@Service
@CacheConfig(cacheNames = "RecentlyListenedServiceAlbums")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RecentlyListenedService {

	private static final Logger LOG = LoggerFactory.getLogger(RecentlyListenedService.class);

	private static final int MAX_RESULTS = 100;

	private final MPD mpd;

	/**
	 * To enable caching when called from class methods. See "Transactions, Caching and
	 * AOP: understanding proxy usage in Spring".
	 */
	@Autowired
	private RecentlyListenedService self;

	private final AmpdSettings ampdSettings;

	private final SearchService searchService;

	private final LbCoreApi lbCoreApi = new LbCoreApi();

	private String lbUsername = null;

	private List<ListensForUserPayloadListensInner> response = new ArrayList<>();

	public RecentlyListenedService(MPD mpd, AmpdSettings ampdSettings, SearchService searchService) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
		this.searchService = searchService;
	}

	public PageImpl<MPDAlbum> getPage(int pageIndex) {
		int pageSize = 12;

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		Set<MPDAlbum> recentlyListenedAlbums = self.getRecentlyListenedAlbums();
		PagedListHolder<MPDAlbum> pages = new PagedListHolder<>(new ArrayList<>(recentlyListenedAlbums));
		pages.setPage(pageIndex);
		pages.setPageSize(pageSize);
		return new PageImpl<>(pages.getPageList(), pageable, recentlyListenedAlbums.size());
	}

	@Cacheable
	public Set<MPDAlbum> getRecentlyListenedAlbums() {
		buildAuth();

		Set<MPDAlbum> recentlyListenedAlbums = new LinkedHashSet<>();

		fetchData().forEach(v -> {
			if (recentlyListenedAlbums.size() == MAX_RESULTS) {
				LOG.trace("Reached MAX_RESULTS - aborting.");
				return;
			}

			TrackMetadata metadata = v.getTrackMetadata();
			String albumArtist = metadata.getArtistName();
			LOG.trace("Processing albumArtist={}", albumArtist);
			String albumName = metadata.getReleaseName();
			LOG.trace("Processing albumName={}", albumName);

			Optional<MPDAlbum> mpdAlbum = mpd.getMusicDatabase()
				.getAlbumDatabase()
				.listAlbumsByArtist(new MPDArtist(albumArtist))
				.stream()
				.filter(item -> item.getName().equals(albumName))
				.findFirst();

			mpdAlbum.ifPresentOrElse(item -> {
				// Some albums don't use albumArtist but artistNames
				// Make sure albumArtist is set
				if (isNullOrEmpty(item.getAlbumArtist())) {
					item.setAlbumArtist(albumArtist);
				}

				// Clear artistNames because they contain features
				// This leads to duplicate albums in the result
				item.setArtistNames(new ArrayList<>());

				// Also clear genres since we don't need them
				item.setGenres(new ArrayList<>());

				// Also clear dates since we don't need them
				item.setDates(new ArrayList<>());

				LOG.trace("Adding item={} to return list", item);

				recentlyListenedAlbums.add(item);
			}, () -> LOG.trace("Did not find an album"));
		});

		return recentlyListenedAlbums;
	}

	public Set<MPDArtist> getRecentlyListenedArtists() {
		Set<MPDArtist> artists = new LinkedHashSet<>();
		fetchData().forEach(v -> {

			if (artists.size() == MAX_RESULTS) {
				return;
			}

			TrackMetadata metadata = v.getTrackMetadata();
			String artist = metadata.getArtistName();
			artists.add(mpd.getMusicDatabase().getArtistDatabase().listArtistByName(artist));
		});

		return artists;
	}

	public Set<MPDSong> getRecentlyListenedTracks() {
		Set<MPDSong> tracks = new LinkedHashSet<>();
		fetchData().forEach(v -> {

			if (tracks.size() == MAX_RESULTS) {
				return;
			}

			TrackMetadata metadata = v.getTrackMetadata();
			String artist = metadata.getArtistName();
			String album = metadata.getReleaseName();
			String title = metadata.getReleaseName();

			Map<String, String> params = Map.of("album", album, "albumartist", artist, "title", title);
			searchService.advSearch(params, 0, 1).get().findFirst().ifPresent(tracks::add);
		});
		return tracks;
	}

	private List<ListensForUserPayloadListensInner> fetchData() {
		LOG.debug("Fetching data from ListenBrainz API");
		try {
			int listens = 1000;
			response = Objects.requireNonNull(
					lbCoreApi.listensForUser(lbUsername).count(listens).execute().getPayload().getListens());
		}
		catch (ApiException e) {
			LOG.error("Could not get listensForUser, username={}", lbUsername, e);
		}
		return response;
	}

	private void buildAuth() {
		try {
			ValidateToken a = lbCoreApi.validateToken().execute();
			if (a.getValid()) {
				lbUsername = a.getUserName();
				return;
			}

		}
		catch (ApiException e) {
			throw new RuntimeException(e);
		}

		lbCoreApi.getApiClient().setApiKey("Token " + ampdSettings.getListenbrainzToken());
		try {
			ValidateToken a = lbCoreApi.validateToken().execute();
			lbUsername = a.getUserName();
		}
		catch (ApiException e) {
			LOG.error("Could not determine ListenBrainz username", e);
		}
	}

}
