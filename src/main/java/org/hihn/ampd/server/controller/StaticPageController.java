package org.hihn.ampd.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class StaticPageController {

  @RequestMapping(value = "/{[path:[^api]*}")
  public String redirect() {
    return "forward:/index.html";
  }
}
