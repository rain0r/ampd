package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.listenbrainz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RecentlyListenedService {

	private static final Logger LOG = LoggerFactory.getLogger(RecentlyListenedService.class);

	private final int MAX_RESULTS = 10;

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	private final SearchService searchService;

	private final LbCoreApi lbCoreApi = new LbCoreApi();

	private String lbUsername = null;

	private LocalDateTime lastCall = LocalDateTime.now().minusYears(1L);

	private List<ListensForUserPayloadListensInner> response = new ArrayList<>();

	public RecentlyListenedService(MPD mpd, AmpdSettings ampdSettings, SearchService searchService) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
		this.searchService = searchService;
		buildAuth();
	}

	@Cacheable
	public LinkedHashSet<MPDAlbum> getRecentlyListenedAlbums() {
		LinkedHashSet<MPDAlbum> albums = new LinkedHashSet<>();
		Set<String> alreadySearched = new TreeSet<>();

		fetchData().forEach(v -> {

			if (albums.size() == MAX_RESULTS) {
				return;
			}

			TrackMetadata metadata = Objects.requireNonNull(v.getTrackMetadata());
			String artist = Objects.requireNonNull(metadata.getArtistName());
			String album = Objects.requireNonNull(metadata.getReleaseName());

			// Abort if we already searched MPD for this album and artist
			String pair = artist + "-" + album;
			if (alreadySearched.contains(pair)) {
				return;
			}

			// Check, if we have this song in the database
			Optional<MPDAlbum> mpdAlbum = mpd.getMusicDatabase()
				.getAlbumDatabase()
				.listAlbumsByArtist(new MPDArtist(artist))
				.stream()
				.filter(item -> item.getName().equals(album))
				.filter(item -> item.getAlbumArtist() != null && !item.getArtistNames().isEmpty())
				.findFirst()
				.map(item -> {
					// Clear artist names so that an album doesn't appear twice if
					// there is a feature involved
					item.getArtistNames().clear();
					return item;
				});

			mpdAlbum.ifPresent(albums::add);
			alreadySearched.add(pair);
		});

		return albums;
	}

	public LinkedHashSet<MPDArtist> getRecentlyListenedArtists() {
		LinkedHashSet<MPDArtist> artists = new LinkedHashSet<>();
		fetchData().forEach(v -> {

			if (artists.size() == MAX_RESULTS) {
				return;
			}

			TrackMetadata metadata = Objects.requireNonNull(v.getTrackMetadata());
			String artist = Objects.requireNonNull(metadata.getArtistName());
			artists.add(mpd.getMusicDatabase().getArtistDatabase().listArtistByName(artist));
		});

		return artists;
	}

	public LinkedHashSet<MPDSong> getRecentlyListenedTracks() {
		LinkedHashSet<MPDSong> tracks = new LinkedHashSet<>();
		fetchData().forEach(v -> {

			if (tracks.size() == MAX_RESULTS) {
				return;
			}

			TrackMetadata metadata = Objects.requireNonNull(v.getTrackMetadata());
			String artist = Objects.requireNonNull(metadata.getArtistName());
			String album = Objects.requireNonNull(metadata.getReleaseName());
			String title = Objects.requireNonNull(metadata.getReleaseName());

			Map<String, String> params = Map.of("album", album, "albumartist", artist, "title", title);
			searchService.advSearch(params, 0, 1).get().findFirst().ifPresent(tracks::add);
		});
		return tracks;
	}

	private List<ListensForUserPayloadListensInner> fetchData() {
		LocalDateTime now = LocalDateTime.now();
		if (now.isBefore(lastCall.plusHours(1))) {
			// Fetch data only if the saved response is older than one hour
			return response;
		}
		try {
			response = Objects
				.requireNonNull(lbCoreApi.listensForUser(lbUsername).count(200).execute().getPayload().getListens());
		}
		catch (ApiException e) {
			LOG.error("Could not get listensForUser, username={}", lbUsername, e);
		}
		lastCall = now;
		return response;
	}

	private void buildAuth() {
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
