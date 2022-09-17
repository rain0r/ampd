package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.model.LastFmSimilarTracks;
import org.hihn.ampd.server.service.scrobbler.LastFmScrobbleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/last-fm")
public class LastFmController {

	private final LastFmScrobbleService lastFmScrobbleService;

	public LastFmController(LastFmScrobbleService lastFmScrobbleService) {
		this.lastFmScrobbleService = lastFmScrobbleService;
	}

	@GetMapping("/similar-tracks")
	public LastFmSimilarTracks getSimilarTracks(@RequestParam String artist, @RequestParam String title) {
		return lastFmScrobbleService.getSimilarTracks(artist, title);
	}

}
