package org.hihn.ampd.server.controller;

import de.umass.lastfm.Track;
import org.hihn.ampd.server.model.AmpdSettings;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class LastFmController {

	private final AmpdSettings ampdSettings;

	public LastFmController(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
	}

	@GetMapping("/similar-tracks")
	public Collection<Track> getSimilarTracks(@RequestParam String artist, @RequestParam String title) {
		Collection<Track> results = Track.getSimilar(artist, title, ampdSettings.getLastfmApiKey());
		return results;
	}

}
