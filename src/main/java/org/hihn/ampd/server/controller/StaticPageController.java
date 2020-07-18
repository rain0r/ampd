package org.hihn.ampd.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class StaticPageController {

  @RequestMapping(value = {"/", "/browse", "/search", "/settings", "/ampd/"})
  public String index() {
    return "forward:/index.html";
  }
}
