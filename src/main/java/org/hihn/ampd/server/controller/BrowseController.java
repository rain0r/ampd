package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.message.outgoing.browse.BrowsePayload;
import org.hihn.ampd.server.service.BrowseService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint to retrieve browsing info.
 */
@RestController
@RequestMapping("/api/browse")
public class BrowseController {

	private final BrowseService browseService;

	public BrowseController(BrowseService browseService) {
		this.browseService = browseService;
	}

	@GetMapping("")
	public BrowsePayload browseDir(@RequestParam("path") String dirPath) {
		return browseService.browse(dirPath);
	}

}
