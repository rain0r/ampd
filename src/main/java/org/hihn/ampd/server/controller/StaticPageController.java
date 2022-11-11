package org.hihn.ampd.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Serves the static html-file containing the frontend.
 */
@Controller
public class StaticPageController {

	/**
	 * Always return the Angular app.
	 * @return Path to the html-file that contains Angular app.
	 */
	@RequestMapping(value = { "/", "/browse", "browse/albums", "browse/genres", "browse/radio-streams", "/search",
			"/search-form", "/settings", "/ampd/", "/adv-search" })
	public String index() {
		return "forward:/index.html";
	}

}
