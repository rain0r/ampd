package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
import org.bff.javampd.playlist.MPDPlaylistSong;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlbumService {

	private static final Logger LOG = LoggerFactory.getLogger(AlbumService.class);

	private final MPD mpd;

	private final AmpdSettings ampdSettings;

	public AlbumService(MPD mpd, AmpdSettings ampdSettings) {
		this.mpd = mpd;
		this.ampdSettings = ampdSettings;
	}

	@Cacheable("albums")
	public TreeSet<MPDAlbum> listAllAlbums(int page, String searchTerm) {
		LOG.debug("searchTerm: " + searchTerm + " page: " + page);
		final String st = searchTerm.toLowerCase().trim();
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

	@Cacheable("albums")
	public Collection<MPDAlbum> _listAllAlbums(int page, String searchTerm) {
		LOG.debug("listAllAlbums page: " + page);
		if (page < 1) {
			return new ArrayList<>();
		}

		searchTerm = searchTerm.toLowerCase().trim();
		int counter = 1;
		int start = (page - 1) * ampdSettings.getAlbumsPageSize();
		int end = start + ampdSettings.getAlbumsPageSize() - 1;

		ArrayList<MPDAlbum> ret = new ArrayList<>();
		Collection<MPDArtist> artists;
		try {
			artists = mpd.getMusicDatabase().getArtistDatabase().listAllArtists();
		}
		catch (Exception e) {
			LOG.error("Could not load all artists");
			return new ArrayList<>();
		}

		for (MPDArtist artist : artists) {
			LOG.trace("Finding albums for artist: " + artist.getName());
			List<MPDAlbum> albums;
			try {
				albums = mpd.getMusicDatabase().getAlbumDatabase().listAlbumsByArtist(artist).stream()
						.filter(album -> !album.getName().isEmpty()).filter(album -> !album.getArtistNames().isEmpty())
						.collect(Collectors.toList());
				LOG.trace("Found " + albums.size() + " albums");
			}
			catch (Exception e) {
				LOG.error("Could not find any albums: {}", e.getMessage());
				continue;
			}

			for (MPDAlbum album : albums) {
				if (searchTerm.isEmpty()) {
					ret.add(album);
				}
				else {
					if (album.getName().toLowerCase().contains(searchTerm.toLowerCase())
							|| album.getArtistNames().get(0).toLowerCase().contains(searchTerm.toLowerCase())) {
						ret.add(album);
					}
				}

				if (counter >= start) {
					counter += 1;
				}
				if (ret.size() == end) {
					break;
				}
			}
			if (ret.size() == end) {
				break;
			}
		}
		try {
			end = Math.min(ret.size(), end);
			return ret.subList(start, end);
		}
		catch (IndexOutOfBoundsException e) {
			LOG.error("Could not return a subList. start: " + start + " end: " + end);
			return new ArrayList<>();
		}
	}

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
