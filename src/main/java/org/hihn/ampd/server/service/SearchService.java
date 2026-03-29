package org.hihn.ampd.server.service;

import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SearchService {

	private static final List<String> SEARCH_FIELDS = Arrays.stream(SongSearcher.ScopeType.values())
		.map(SongSearcher.ScopeType::toString)
		.map(String::toLowerCase)
		.toList();

	@Autowired
	private final MPD mpd;

	public SearchService(final MPD mpd) {
		this.mpd = mpd;
	}

	/**
	 * Takes a search-term and searches the MPD database for it.
	 * @param query The term to search for.
	 * @return A payload with the search results.
	 */
	public PageImpl<MPDSong> search(final String query, final Pageable pageable) {
		List<MPDSong> all = new ArrayList<>(mpd.getSongSearcher().search(SongSearcher.ScopeType.ANY, query.trim()));
		int start = (int) pageable.getOffset(); // page * size
		int end = Math.min(start + pageable.getPageSize(), all.size());
		List<MPDSong> content = (start <= end) ? all.subList(start, end) : Collections.emptyList();
		return new PageImpl<>(content, pageable, all.size());
	}

	public PageImpl<MPDSong> advSearch(final Map<String, String> searchParams, final Pageable pageable) {
		List<MPDSong> all = searchByParams(searchParams);
		int start = (int) pageable.getOffset(); // page * size
		int end = Math.min(start + pageable.getPageSize(), all.size());
		List<MPDSong> content = (start <= end) ? all.subList(start, end) : Collections.emptyList();
		return new PageImpl<>(content, pageable, all.size());
	}

	private SongSearcher.ScopeType scopeTypeForStr(final String typeName) {
		return Arrays.stream(SongSearcher.ScopeType.values())
			.filter(scopeType -> scopeType.getType().equals(typeName))
			.findFirst()
			.orElseThrow();
	}

	public void addTracks(final Map<String, String> searchParams) {
		searchByParams(searchParams).stream().map(MPDSong::getFile).forEach(t -> mpd.getPlaylist().addSong(t));
	}

	public List<MPDSong> searchByParams(final Map<String, String> searchParams) {
		List<SearchCriteria> tmpSp = new ArrayList<>();
		for (Map.Entry<String, String> entry : searchParams.entrySet()) {
			if (SEARCH_FIELDS.contains(entry.getKey()) && entry.getValue() != null) {
				tmpSp.add(new SearchCriteria(scopeTypeForStr(entry.getKey()), entry.getValue()));
			}
		}

		List<MPDSong> ret = new ArrayList<>();

		if (!tmpSp.isEmpty()) {
			ret = new ArrayList<>(mpd.getSongSearcher().search(tmpSp.toArray(SearchCriteria[]::new)));
		}

		return ret;
	}

}
