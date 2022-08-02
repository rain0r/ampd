package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.message.outgoing.GenrePayload;
import org.hihn.ampd.server.service.GenreService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class GenreController {

	private final GenreService genreService;

	public GenreController(GenreService genreService) {
		this.genreService = genreService;
	}

	@GetMapping("/genres")
	public Set<String> listGenres() {
		return genreService.listGenres();
	}

	@GetMapping("/genre")
	public GenrePayload listGenre(@RequestParam("genre") String genre) {
		return genreService.listGenre(genre);
	}

}
