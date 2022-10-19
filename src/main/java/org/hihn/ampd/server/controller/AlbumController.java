package org.hihn.ampd.server.controller;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.service.AlbumService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class AlbumController {

	private final AlbumService albumService;

	public AlbumController(AlbumService albumService) {
		this.albumService = albumService;
	}

	@GetMapping("/albums")
	public Collection<MPDAlbum> listAllAlbums(@RequestParam(value = "page", defaultValue = "1") Integer page,
			@RequestParam(value = "searchTerm", defaultValue = "") String searchTerm,
			@RequestParam(value = "sortBy", defaultValue = "") String sortBy) {
		return albumService.listAllAlbums(page, searchTerm, sortBy);
	}

	@GetMapping("/album")
	public Collection<MPDSong> listAlbum(@RequestParam("name") String album,
			@RequestParam("artistName") String artist) {
		return albumService.listAlbum(album, artist);
	}

}
