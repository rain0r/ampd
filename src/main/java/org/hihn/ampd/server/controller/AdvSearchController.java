package org.hihn.ampd.server.controller;

import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.service.SearchService;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Endpoint for search queries.
 */
@RestController
@RequestMapping("/api/adv-search")
public class AdvSearchController {

	private final SearchService searchService;

	public AdvSearchController(SearchService searchService) {
		this.searchService = searchService;
	}

	@GetMapping("")
	public PageImpl<MPDSong> search(@RequestParam Map<String, String> searchParams,
			@RequestParam(defaultValue = "0") int page) {
		return searchService.search(searchParams, page);
	}

}
