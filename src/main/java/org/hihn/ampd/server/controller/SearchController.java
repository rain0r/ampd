package org.hihn.ampd.server.controller;

import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.outgoing.SearchPayload;
import org.hihn.ampd.server.service.SearchService;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import static org.hihn.ampd.server.util.Constants.DEFAULT_PAGE_SIZE_REQ_PARAM;

/**
 * Endpoint for search queries.
 */
@RestController
@RequestMapping("/api")
public class SearchController {

	private final SearchService searchService;

	public SearchController(SearchService searchService) {
		this.searchService = searchService;
	}

	/**
	 * Receives a search term and processes it.
	 * @param searchTerm The term to search for.
	 * @return A {@link SearchPayload}-object contain
	 */
	@GetMapping("/search")
	public PageImpl<MPDSong> search(@RequestParam("term") String searchTerm,
			@RequestParam(defaultValue = "0") int pageIndex,
			@RequestParam(defaultValue = DEFAULT_PAGE_SIZE_REQ_PARAM) int pageSize) {
		return searchService.search(searchTerm, pageIndex, pageSize);
	}

	@GetMapping("/adv-search")
	public PageImpl<MPDSong> advSearch(@RequestParam Map<String, String> searchParams,
			@RequestParam(defaultValue = "0") int pageIndex,
			@RequestParam(defaultValue = DEFAULT_PAGE_SIZE_REQ_PARAM) int pageSize) {
		return searchService.advSearch(searchParams, pageIndex, pageSize);
	}

	@PostMapping("/adv-search")
	public void savePlaylist(@RequestBody Map<String, String> searchParams) {
		searchService.addTracks(searchParams);
	}

}
