package org.hihn.ampd.server.service;

import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.hihn.ampd.server.model.AmpdSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

	private final AmpdSettings ampdSettings;

	private static final List<String> SEARCH_FIELDS = Arrays.stream(SongSearcher.ScopeType.values())
		.map(SongSearcher.ScopeType::toString)
		.map(String::toLowerCase)
		.toList();

	@Autowired
	private final MPD mpd;

	public SearchService(AmpdSettings ampdSettings, MPD mpd) {
		this.ampdSettings = ampdSettings;
		this.mpd = mpd;
	}

	/**
	 * Takes a search-term and searches the MPD database for it.
	 * @param query The term to search for.
	 * @return A payload with the search results.
	 */
	public PageImpl<MPDSong> search(String query, int pageIndex, Integer pageSize) {
		List<MPDSong> ret = new ArrayList<>(mpd.getSongSearcher().search(SongSearcher.ScopeType.ANY, query.trim()));
		Pageable pageable = PageRequest.of(pageIndex, getPageSize(pageSize));
		PagedListHolder<MPDSong> pages = new PagedListHolder<>(ret);
		pages.setPage(pageIndex);
		pages.setPageSize(getPageSize(pageSize));
		return new PageImpl<>(pages.getPageList(), pageable, ret.size());
	}

	public PageImpl<MPDSong> advSearch(Map<String, String> searchParams, int pageIndex, Integer pageSize) {
		List<MPDSong> ret = searchByParams(searchParams);
		Pageable pageable = PageRequest.of(pageIndex, getPageSize(pageSize));
		PagedListHolder<MPDSong> pages = new PagedListHolder<>(ret);
		pages.setPage(pageIndex);
		pages.setPageSize(getPageSize(pageSize));
		return new PageImpl<>(pages.getPageList(), pageable, ret.size());
	}

	private int getPageSize(Integer pageSize) {
		return pageSize == null ? ampdSettings.getSearchPageSize() : pageSize;
	}

	private SongSearcher.ScopeType scopeTypeForStr(String typeName) {
		return Arrays.stream(SongSearcher.ScopeType.values())
			.filter(scopeType -> scopeType.getType().equals(typeName))
			.findFirst()
			.orElseThrow();
	}

	public void addTracks(Map<String, String> searchParams) {
		searchByParams(searchParams).stream().map(MPDSong::getFile).forEach(t -> mpd.getPlaylist().addSong(t));
	}

	public List<MPDSong> searchByParams(Map<String, String> searchParams) {
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
