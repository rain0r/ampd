package org.hihn.ampd.server.controller;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.service.RecentlyListenedService;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api/browse/recently-listened")
public class RecentlyListenedController {

	private final RecentlyListenedService recentlyListenedService;

	public RecentlyListenedController(RecentlyListenedService recentlyListenedService) {
		this.recentlyListenedService = recentlyListenedService;
	}

	@GetMapping("/albums")
	public PageImpl<MPDAlbum> getAlbums(@RequestParam(defaultValue = "0") int pageIndex) {
		return recentlyListenedService.getPage(pageIndex);
	}

	@GetMapping("/artists")
	public Set<MPDArtist> getArtists() {
		return recentlyListenedService.getRecentlyListenedArtists();
	}

	@GetMapping("/tracks")
	public Set<MPDSong> getTracks() {
		return recentlyListenedService.getRecentlyListenedTracks();
	}

}
