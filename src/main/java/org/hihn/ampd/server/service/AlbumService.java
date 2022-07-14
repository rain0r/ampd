package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Comparator;
import java.util.Optional;
import java.util.TreeSet;
import java.util.stream.Collectors;

/**
 * Provides methods to browse through {@link MPDAlbum} of the collection.
 */
@Service
public class AlbumService {

	private static final Logger LOG = LoggerFactory.getLogger(AlbumService.class);

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	public AlbumService(MPD mpd, AmpdSettings ampdSettings) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
	}

	@Cacheable("listAlbums")
	public TreeSet<MPDAlbum> listAllAlbums(int page, String searchTerm) {
		String st = searchTerm.toLowerCase().trim();
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
			return album.getName().toLowerCase().contains(st) || album.getAlbumArtist().toLowerCase().contains(st)
					|| album.getArtistNames().get(0).toLowerCase().contains(st);
		}).collect(Collectors.toList());
		return alive.stream().skip(start) // the offset
				.limit(ampdSettings.getAlbumsPageSize()) // how many items you want
				.collect(Collectors.toCollection(() -> new TreeSet<>(
						Comparator.comparing(MPDAlbum::getAlbumArtist).thenComparing(MPDAlbum::getName))));
	}

	@Cacheable("listAlbum")
	public Collection<MPDSong> listAlbum(String album, String artist) {
		MPDAlbum mpdAlbum = MPDAlbum.builder(album).albumArtist(artist).build();
		Collection<MPDSong> songs = mpd.getMusicDatabase().getSongDatabase().findAlbum(mpdAlbum);
		return songs;
	}

	public void addAlbum(MPDAlbum mpdAlbum) {
		mpd.getPlaylist().insertAlbum(mpdAlbum);
	}

	public void playAlbum(MPDAlbum mpdAlbum) {
		addAlbum(mpdAlbum);
		Optional<MPDSong> firstSong = mpd.getMusicDatabase().getSongDatabase().findAlbum(mpdAlbum).stream()
				.sorted(Comparator.comparing(MPDSong::getTrack)).findFirst();
		firstSong.ifPresent(s -> {
			MPDPlaylistSong a = MPDPlaylistSong.builder().file(s.getFile()).build();
			mpd.getPlayer().playSong(a);
		});
	}

}
