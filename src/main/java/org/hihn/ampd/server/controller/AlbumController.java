package org.hihn.ampd.server.controller;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.service.AlbumService;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

import static org.hihn.ampd.server.util.Constants.DEFAULT_PAGE_SIZE_REQ_PARAM;

@RestController
@RequestMapping("/api")
public class AlbumController {

	private final AlbumService albumService;

	public AlbumController(AlbumService albumService) {
		this.albumService = albumService;
	}

	@GetMapping("/albums")
	public PageImpl<MPDAlbum> listAllAlbums(@RequestParam(value = "searchTerm", defaultValue = "") String searchTerm,
			@RequestParam(defaultValue = "0") int pageIndex,
			@RequestParam(defaultValue = DEFAULT_PAGE_SIZE_REQ_PARAM) int pageSize,
			@RequestParam(value = "sortBy", defaultValue = "") String sortBy) {
		return albumService.listAllAlbums(searchTerm, pageIndex, pageSize, sortBy);
	}

	@GetMapping("/album")
	public Collection<MPDSong> listAlbum(@RequestParam("name") String album,
			@RequestParam("artistName") String artist) {
		return albumService.listAlbum(album, artist);
	}

}
