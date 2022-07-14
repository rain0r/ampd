package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.genre.MPDGenre;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.hihn.ampd.server.message.outgoing.GenrePayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

/**
 * Provides methods to browse through genres of the collection.
 */
@Service
public class GenreService {

	private static final Logger LOG = LoggerFactory.getLogger(GenreService.class);

	private final MPD mpd;

	public GenreService(MPD mpd) {
		this.mpd = mpd;
	}

	@Cacheable("listGenres")
	public Set<String> listGenres() {
		Set<String> ret = new TreeSet<>();
		for (MPDGenre mpdGenre : mpd.getMusicDatabase().getGenreDatabase().listAllGenres()) {
			String[] genres = mpdGenre.getName().split(",");
			Arrays.stream(genres).filter(g -> !g.isBlank()).forEach(g -> ret.add(g.trim()));
		}
		return ret;
	}

	@Cacheable("listGenre")
	public GenrePayload listGenre(String genre) {
		if (genre.isBlank()) {
			return new GenrePayload(genre, Set.of(), Set.of());
		}
		return new GenrePayload(genre, searchTracks(genre), searchAlbums(genre));
	}

	private Set<MPDAlbum> searchAlbums(String genre) {
		Set<MPDAlbum> ret = new TreeSet<>();
		mpd.getMusicDatabase().getAlbumDatabase().listAllAlbums().stream()
				.filter(mpdAlbum -> !mpdAlbum.getGenres().isEmpty() && !mpdAlbum.getName().isEmpty())
				.forEach(mpdAlbum -> {
					Set<String> genres = new TreeSet<>();
					for (String s : mpdAlbum.getGenres()) {
						// Some tracks have multiple genre delimited with a comma
						String[] splitGenres = s.split(",");
						for (String sg : splitGenres) {
							genres.add(sg.trim());
						}
					}
					if (genres.contains(genre)) {
						ret.add(mpdAlbum);
					}
				});
		return ret;
	}

	private Set<MPDSong> searchTracks(String genre) {
		TreeSet<MPDSong> tracks = new TreeSet<>(new MPDSongComparator());
		SongSearcher songSearcher = mpd.getSongSearcher();
		SearchCriteria crit = new SearchCriteria(SongSearcher.ScopeType.GENRE, genre);
		tracks.addAll(songSearcher.search(crit));
		return tracks;
	}

	private static class MPDSongComparator implements Comparator<MPDSong>, Serializable {

		@Override
		public int compare(MPDSong o1, MPDSong o2) {
			if (o1.getAlbumArtist() == null && o2.getAlbumArtist() == null) {
				return o1.getName().compareTo(o2.getName());
			}

			if (o1.getAlbumArtist() != null && o2.getAlbumArtist() != null) {
				if (o1.getAlbumArtist().equals(o2.getAlbumArtist())) {
					return o1.getName().compareTo(o2.getName());
				}
				return o1.getAlbumArtist().compareTo(o2.getAlbumArtist());
			}

			return o1.getName().compareTo(o2.getName());
		}

	}

	private static class MpdAlbumComparator implements Comparator<MPDAlbum>, Serializable {

		@Override
		public int compare(MPDAlbum o1, MPDAlbum o2) {
			if (o1.getAlbumArtist() == null && o2.getAlbumArtist() == null) {
				return o1.getName().compareTo(o2.getName());
			}

			if (o1.getAlbumArtist() != null && o2.getAlbumArtist() != null) {
				if (o1.getAlbumArtist().equals(o2.getAlbumArtist())) {
					return o1.getName().compareTo(o2.getName());
				}
				return o1.getAlbumArtist().compareTo(o2.getAlbumArtist());
			}

			return o1.getName().compareTo(o2.getName());
		}

	}

}
