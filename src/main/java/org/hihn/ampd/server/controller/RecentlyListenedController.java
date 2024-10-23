package org.hihn.ampd.server.controller;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.service.RecentlyListenedService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashSet;

@RestController
@RequestMapping("/api/browse/recently-listened")
public class RecentlyListenedController {

	private final RecentlyListenedService recentlyListenedService;

	public RecentlyListenedController(RecentlyListenedService recentlyListenedService) {
		this.recentlyListenedService = recentlyListenedService;
	}

	@GetMapping("/albums")
	public LinkedHashSet<MPDAlbum> getAlbums() {
		return recentlyListenedService.getRecentlyListenedAlbums();
	}

	@GetMapping("/artists")
	public LinkedHashSet<MPDArtist> getArtists() {
		return recentlyListenedService.getRecentlyListenedArtists();
	}

	@GetMapping("/tracks")
	public LinkedHashSet<MPDSong> getTracks() {
		return recentlyListenedService.getRecentlyListenedTracks();
	}

}
