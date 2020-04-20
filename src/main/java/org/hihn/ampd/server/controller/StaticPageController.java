package org.hihn.ampd.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Delivers the Angular app.
 */
@Controller
public class StaticPageController {

  @SuppressWarnings("checkstyle:missingjavadocmethod")
  @RequestMapping(value = {"/", "/browse", "/search", "/settings", "/ampd/"})
  public String index() {
    return "/index.html";
  }
}
