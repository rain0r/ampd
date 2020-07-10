package org.hihn.ampd.server.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import org.hihn.ampd.server.model.PlaylistInfo;
import org.hihn.ampd.server.service.MpdService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class PlaylistController {

  private final MpdService mpdService;

  public PlaylistController(MpdService mpdService) {
    this.mpdService = mpdService;
  }

  @RequestMapping(value = "/playlist/{name}", method = GET)
  public PlaylistInfo getPlaylist(@PathVariable("name") String name) {
    return mpdService.getPlaylistInfo(name).orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND));
  }
}
