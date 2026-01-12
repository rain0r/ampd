package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.genre.MPDGenre;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.hihn.ampd.server.message.outgoing.GenrePayload;
import org.hihn.ampd.server.util.StringUtils;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Provides methods to browse through genres of the collection.
 */
@Service
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

	public GenrePayload listGenre(final String genre, final int pageIndex, final int pageSize) {
		if (genre.isBlank()) {
			return new GenrePayload(genre, null, null);
		}
		return new GenrePayload(genre, getTracks(genre, pageIndex, pageSize), getAlbums(genre, pageIndex, pageSize));
	}

	private PageImpl<MPDAlbum> getAlbums(final String genre, final int pageIndex, final int pageSize) {
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
		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		PagedListHolder<MPDAlbum> pages = new PagedListHolder<>(albums);
		pages.setPage(pageIndex);
		pages.setPageSize(pageSize);
		return new PageImpl<>(pages.getPageList(), pageable, albums.size());
	}

	private PageImpl<MPDSong> getTracks(final String genre, final int pageIndex, final int pageSize) {
		SongSearcher songSearcher = mpd.getSongSearcher();
		SearchCriteria crit = new SearchCriteria(SongSearcher.ScopeType.GENRE, genre);
		List<MPDSong> tracks = new ArrayList<>(songSearcher.search(crit));

		Comparator<MPDSong> trackComp = Comparator
			.comparing(MPDSong::getAlbumArtist, Comparator.nullsLast(Comparator.naturalOrder()))
			.thenComparing(MPDSong::getName, Comparator.nullsLast(Comparator.naturalOrder()));

		tracks.sort(trackComp);

		Pageable pageable = PageRequest.of(pageIndex, pageSize);
		PagedListHolder<MPDSong> pages = new PagedListHolder<>(tracks);
		pages.setPage(pageIndex);
		pages.setPageSize(pageSize);
		return new PageImpl<>(pages.getPageList(), pageable, tracks.size());
	}

}
