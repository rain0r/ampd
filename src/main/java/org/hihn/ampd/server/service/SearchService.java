package org.hihn.ampd.server.service;

import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.hihn.ampd.server.model.AmpdSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchService {

	private static final int PAGE_SIZE = 5;

	private final AmpdSettings ampdSettings;

	private static final List<String> SEARCH_FIELDS = Arrays.stream(SongSearcher.ScopeType.values())
			.map(SongSearcher.ScopeType::toString).map(String::toLowerCase).collect(Collectors.toList());

	@Autowired
	private final MPD mpd;

	public SearchService(AmpdSettings ampdSettings, MPD mpd) {
		this.ampdSettings = ampdSettings;
		this.mpd = mpd;
	}

	@Cacheable
	public PageImpl<MPDSong> search(Map<String, String> searchParams, int page) {
		ArrayList<SearchCriteria> tmpSp = new ArrayList<>();
		for (Map.Entry<String, String> entry : searchParams.entrySet()) {
			if (SEARCH_FIELDS.contains(entry.getKey())) {
				tmpSp.add(new SearchCriteria(scopeTypeForStr(entry.getKey()), entry.getValue()));
			}
		}

		List<MPDSong> ret = new ArrayList<>();

		if (!tmpSp.isEmpty()) {
			ret = new ArrayList<>(mpd.getSongSearcher().search(tmpSp.toArray(SearchCriteria[]::new)));
		}

		Pageable pageable = PageRequest.of(0, ampdSettings.getAdvSearchPageSize());
		PagedListHolder<MPDSong> pages = new PagedListHolder<>(ret);
		pages.setPage(page);
		pages.setPageSize(ampdSettings.getAdvSearchPageSize());

		return new PageImpl<>(pages.getPageList(), pageable, ret.size());
	}

	private SongSearcher.ScopeType scopeTypeForStr(String typeName) {
		return Arrays.stream(SongSearcher.ScopeType.values()).filter(scopeType -> scopeType.getType().equals(typeName))
				.findFirst().orElseThrow();
	}

}
