package org.hihn.ampd.server.service;

import org.bff.javampd.server.MPD;
import org.bff.javampd.server.MPDConnectionException;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SearchCriteria;
import org.bff.javampd.song.SongSearcher;
import org.hihn.ampd.server.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SearchService {

	private static final Logger LOG = LoggerFactory.getLogger(SearchService.class);

	private static final int PAGE_SIZE = 100;

	@Autowired
	private final MPD mpd;

	public SearchService(MPD mpd) {
		this.mpd = mpd;
	}

	@Cacheable
	public PageImpl<MPDSong> search(Map<String, String> searchParams, int page) {
		LOG.debug("searchParams: {}", searchParams);
		List<MPDSong> ret;
		try {
			ret = new ArrayList<>(mpd.getSongSearcher().search(searchParams.entrySet().stream()
					.filter(entry -> !StringUtils.isNullOrEmpty(entry.getValue())).map(entry -> {
						SongSearcher.ScopeType scopeType = scopeTypeForStr(entry.getKey());
						return new SearchCriteria(scopeType, entry.getValue());
					}).toArray(SearchCriteria[]::new)));
		}
		catch (NoSuchElementException | MPDConnectionException e) {
			LOG.error("Error while searching: {}", e.getMessage(), e);
			ret = List.of();
		}
		PagedListHolder<MPDSong> pages = new PagedListHolder<>(ret);
		pages.setPage(page);
		pages.setPageSize(PAGE_SIZE);
		return new PageImpl<>(pages.getPageList());
	}

	private SongSearcher.ScopeType scopeTypeForStr(String typeName) {
		LOG.debug("typeName: {}", typeName);
		return Arrays.stream(SongSearcher.ScopeType.values()).filter(scopeType -> scopeType.getType().equals(typeName))
				.findFirst().orElseThrow();
	}

}
