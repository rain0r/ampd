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
	 * Loads all albums in a cache. Theses albums can be viewed under
	 * {@code /browse/albums}.
	 */
	@Scheduled(fixedDelay = 60, initialDelay = 1, timeUnit = TimeUnit.MINUTES)
	public void fillAlbumsCache() {
		albums = mpd.getMusicDatabase().getAlbumDatabase().listAllAlbums().parallelStream().filter(album -> {
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
		}).collect(Collectors.toUnmodifiableSet());
	}

	public void triggerFillAlbumsCache() {
		fillAlbumsCache();
	}

	public PageImpl<MPDAlbum> listAllAlbums(String searchTermP, int pageIndex, Integer pageSize, String sortBy) {
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

		Pageable pageable = PageRequest.of(pageIndex, getPageSize(pageSize));
		PagedListHolder<MPDAlbum> pages = new PagedListHolder<>(filteredAlbums);
		pages.setPage(pageIndex);
		pages.setPageSize(getPageSize(pageSize));
		return new PageImpl<>(pages.getPageList(), pageable, filteredAlbums.size());
	}

	public Collection<MPDSong> listAlbum(String album, String artist) {
		MPDAlbum mpdAlbum = MPDAlbum.builder(album).albumArtist(artist).build();
		return mpd.getMusicDatabase().getSongDatabase().findAlbum(mpdAlbum);
	}

	private int getPageSize(Integer pageSize) {
		return pageSize == null ? ampdSettings.getAlbumsPageSize() : pageSize;
	}

}
