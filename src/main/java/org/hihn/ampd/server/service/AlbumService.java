package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Comparator;
import java.util.TreeSet;
import java.util.stream.Collectors;

import static org.hihn.ampd.server.Constants.ALBUM_CACHE;

/**
 * Provides methods to browse through {@link MPDAlbum} of the collection.
 */
@Service
@CacheConfig(cacheNames = { ALBUM_CACHE })
public class AlbumService {

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	public AlbumService(MPD mpd, AmpdSettings ampdSettings) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
	}

	@Cacheable
	public TreeSet<MPDAlbum> listAllAlbums(int page, String searchTermP) {
		String searchTerm = searchTermP.toLowerCase().trim();
		int start = (page - 1) * ampdSettings.getAlbumsPageSize();
		Collection<MPDAlbum> albums = mpd.getMusicDatabase().getAlbumDatabase().listAllAlbums();
		Collection<MPDAlbum> alive = albums.stream().filter(album -> {
			if (album.getName().isBlank()) {
				// No album title
				return false;
			}
			if (album.getArtistNames().isEmpty()
					&& (album.getAlbumArtist() == null || album.getAlbumArtist().isBlank())) {
				// No info about the album artist
				return false;
			}
			if (album.getArtistNames().isEmpty()) {
				album.getArtistNames().add(album.getAlbumArtist());
			}
			else {
				album.setAlbumArtist(album.getArtistNames().get(0));
			}
			return album.getName().toLowerCase().contains(searchTerm)
					|| album.getAlbumArtist().toLowerCase().contains(searchTerm)
					|| album.getArtistNames().get(0).toLowerCase().contains(searchTerm);
		}).collect(Collectors.toList());
		return alive.stream().skip(start) // the offset
				.limit(ampdSettings.getAlbumsPageSize()) // how many items you want
				.collect(Collectors.toCollection(() -> new TreeSet<>(
						Comparator.comparing(MPDAlbum::getAlbumArtist).thenComparing(MPDAlbum::getName))));
	}

	@Cacheable
	public Collection<MPDSong> listAlbum(String album, String artist) {
		MPDAlbum mpdAlbum = MPDAlbum.builder(album).albumArtist(artist).build();
		return mpd.getMusicDatabase().getSongDatabase().findAlbum(mpdAlbum);
	}

}
