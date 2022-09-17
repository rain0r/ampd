package org.hihn.ampd.server.controller;

import de.umass.lastfm.Track;
import org.hihn.ampd.server.model.LastFmCred;
import org.hihn.ampd.server.service.scrobbler.LastFmScrobbleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api/last-fm")
public class LastFmController {

	private final LastFmScrobbleService lastFmScrobbleService;

	public LastFmController(LastFmScrobbleService lastFmScrobbleService) {
		this.lastFmScrobbleService = lastFmScrobbleService;
	}

	@GetMapping("/similar-tracks")
	public Collection<Track> getSimilarTracks(@RequestParam String artist, @RequestParam String title) {
		return lastFmScrobbleService.getSimilarTracks(artist, title);
	}

	@GetMapping("/cred")
	public LastFmCred getLastFmCred() {
		return lastFmScrobbleService.getLastFmCred();
	}

}
