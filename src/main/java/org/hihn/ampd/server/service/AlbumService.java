package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.server.MPD;
import org.bff.javampd.server.MPDConnectionException;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Provides methods to browse through {@link MPDAlbum} of the collection.
 */
@Service
public class AlbumService {

	private static final Logger LOG = LoggerFactory.getLogger(AlbumService.class);

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	private Set<MPDAlbum> albums = new TreeSet<>();

	private enum SortBy {

		ALBUM("album"), ARTIST("artist"), RANDOM("random");

		private final String key;

		SortBy(String sortBy) {
			key = sortBy;
		}

		public String getKey() {
			return key;
		}

	}

	public AlbumService(MPD mpd, AmpdSettings ampdSettings) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
	}

	/**
	 * Loads all albums in a cache. These albums can be viewed under
	 * {@code /browse/albums}.
	 */
	@Scheduled(fixedDelayString = "${album-cache.fixed-delay}", initialDelayString = "${album-cache.initial-delay}",
			timeUnit = TimeUnit.MINUTES)
	public void fillAlbumsCache() {
		LOG.debug("Begin filling albums cache...");
		albums = mpd.getMusicDatabase()
			.getAlbumDatabase()
			.listAllAlbumNames()
			.stream()
			.flatMap(name -> mpd.getMusicDatabase().getAlbumDatabase().findAlbum(name).parallelStream())
			.filter(album -> {
				if (album.getName().isBlank()) {
					// No album title
					return false;
				}
				if (album.getArtistNames().isEmpty() && StringUtils.isNullOrEmpty(album.getAlbumArtist())) {
					// No info about the album artist
					return false;
				}
				if (album.getArtistNames().isEmpty()) {
					album.getArtistNames().add(album.getAlbumArtist());
				}
				else {
					album.setAlbumArtist(album.getArtistNames().get(0));
				}

				try {
					int albumContains = mpd.getMusicDatabase().getSongDatabase().findAlbum(album).size();
					if (albumContains < ampdSettings.getAlbumsQualifyMinTracks()) {
						return false;
					}
				}
				catch (MPDConnectionException e) {
					return false;
				}

				return true;
			})
			.collect(Collectors.toUnmodifiableSet());
		LOG.debug("Done filling albums cache...");
	}

	public PageImpl<MPDAlbum> listAllAlbums(final String searchTermP, final int pageIndex, final int pageSize,
			final String sortBy) {
		LOG.trace("listAllAlbums() searchTermP={}, pageIndex={}, pageSize={}, sortBy={}", searchTermP, pageIndex,
				pageSize, sortBy);
		String searchTerm = searchTermP.toLowerCase().trim();

		List<MPDAlbum> filteredAlbums = albums.stream()
			.filter(album -> album.getName().toLowerCase().contains(searchTerm)
					|| album.getAlbumArtist().toLowerCase().contains(searchTerm)
					|| album.getArtistNames().stream().anyMatch(name -> name.toLowerCase().contains(searchTerm)))
			.sorted(Comparator.comparing(album -> {
				if (sortBy.equals(SortBy.ALBUM.getKey())) {
					return album.getName();
				}
				return album.getAlbumArtist();
			}))
			.collect(Collectors.toList());

		if (sortBy.equals(SortBy.RANDOM.getKey())) {
			Collections.shuffle(filteredAlbums);
		}

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		PagedListHolder<MPDAlbum> pages = new PagedListHolder<>(filteredAlbums);
		pages.setPage(pageIndex);
		pages.setPageSize(pageSize);
		LOG.trace("Returning {} albums", pages.getPageList());
		return new PageImpl<>(pages.getPageList(), pageable, filteredAlbums.size());
	}

	public Collection<MPDSong> listAlbum(final String album, final String artist) {
		MPDAlbum mpdAlbum = MPDAlbum.builder(album).albumArtist(artist).build();
		return mpd.getMusicDatabase().getSongDatabase().findAlbum(mpdAlbum);
	}

}
