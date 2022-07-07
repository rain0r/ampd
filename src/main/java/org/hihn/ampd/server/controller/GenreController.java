package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.message.outgoing.GenrePayload;
import org.hihn.ampd.server.service.GenreService;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin
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
	public GenrePayload listGenre(@RequestParam("genre") final String genre) {
		return genreService.listGenre(genre);
	}

}
