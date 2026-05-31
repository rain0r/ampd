package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.genre.MPDGenre;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.hihn.ampd.server.message.outgoing.GenrePayload;
import org.hihn.ampd.server.util.StringUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.hihn.ampd.server.config.CachingConfig.LONG_LIVED;

/**
 * Provides methods to browse through genres of the collection.
 */
@Service
@Cacheable(LONG_LIVED)
public class GenreService {

	private final MPD mpd;

	public GenreService(final MPD mpd) {
		this.mpd = mpd;
	}

	public Set<String> listGenres() {
		Set<String> ret = new TreeSet<>();
		for (MPDGenre mpdGenre : mpd.getMusicDatabase().getGenreDatabase().listAllGenres()) {
			String[] genres = mpdGenre.getName().split(",");
			Arrays.stream(genres).filter(g -> !g.isBlank()).forEach(g -> ret.add(g.trim()));
		}
		return ret;
	}

	public GenrePayload listGenre(final String genre, final Pageable pageable) {
		if (genre.isBlank()) {
			return new GenrePayload(genre, null, null);
		}
		return new GenrePayload(genre, getTracks(genre, pageable), getAlbums(genre, pageable));
	}

	private PageImpl<MPDAlbum> getAlbums(final String genre, final Pageable pageable) {
		List<MPDAlbum> albums = new ArrayList<>();
		mpd.getMusicDatabase()
			.getAlbumDatabase()
			.listAllAlbums()
			.stream()
			.filter(mpdAlbum -> !mpdAlbum.getGenres().isEmpty() && !StringUtils.isNullOrEmpty(mpdAlbum.getName())
					&& !StringUtils.isNullOrEmpty(mpdAlbum.getAlbumArtist()))
			.forEach(mpdAlbum -> {
				Set<String> genres = new TreeSet<>();
				mpdAlbum.getGenres()
					.forEach(foo -> Arrays.stream(foo.split(",")).forEach(bar -> genres.add(bar.trim())));
				if (genres.contains(genre)) {
					albums.add(mpdAlbum);
				}
			});

		int start = (int) pageable.getOffset(); // page * size
		int end = Math.min(start + pageable.getPageSize(), albums.size());
		List<MPDAlbum> content = (start <= end) ? albums.subList(start, end) : Collections.emptyList();
		return new PageImpl<>(content, pageable, albums.size());
	}

	private PageImpl<MPDSong> getTracks(final String genre, final Pageable pageable) {
		SongSearcher songSearcher = mpd.getSongSearcher();
		SearchCriteria crit = new SearchCriteria(SongSearcher.ScopeType.GENRE, genre);
		List<MPDSong> tracks = new ArrayList<>(songSearcher.search(crit));

		Comparator<MPDSong> trackComp = Comparator
			.comparing(MPDSong::getAlbumArtist, Comparator.nullsLast(Comparator.naturalOrder()))
			.thenComparing(MPDSong::getName, Comparator.nullsLast(Comparator.naturalOrder()));

		tracks.sort(trackComp);

		int start = (int) pageable.getOffset(); // page * size
		int end = Math.min(start + pageable.getPageSize(), tracks.size());
		List<MPDSong> content = (start <= end) ? tracks.subList(start, end) : Collections.emptyList();
		return new PageImpl<>(content, pageable, tracks.size());
	}

}
