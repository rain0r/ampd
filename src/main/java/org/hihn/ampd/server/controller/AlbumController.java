package org.hihn.ampd.server.controller;

import java.util.Collection;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.service.AlbumService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AlbumController {

	private final AlbumService albumService;

	public AlbumController(AlbumService albumService) {
		this.albumService = albumService;
	}

	@GetMapping("/albums")
	public Collection<MPDAlbum> listAllAlbums(@RequestParam(value = "page", defaultValue = "1") Integer page,
			@RequestParam(value = "searchTerm", defaultValue = "") String searchTerm) {
		return this.albumService.listAllAlbums(page, searchTerm);
	}

	@GetMapping("/album")
	public Collection<MPDSong> listAlbum(@RequestParam("name") final String album,
			@RequestParam("artistName") final String artist) {
		return this.albumService.listAlbum(album, artist);
	}

}
