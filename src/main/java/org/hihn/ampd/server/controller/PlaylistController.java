package org.hihn.ampd.server.controller;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import org.hihn.ampd.server.model.PlaylistInfo;
import org.hihn.ampd.server.model.http.SavePlaylist;
import org.hihn.ampd.server.model.http.SavePlaylistResponse;
import org.hihn.ampd.server.service.MpdService;
import org.hihn.ampd.server.service.PlaylistService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/playlists")
@CrossOrigin
public class PlaylistController {

  private final MpdService mpdService;

  private final PlaylistService playlistService;

  public PlaylistController(final MpdService mpdService,
      PlaylistService playlistService) {
    this.mpdService = mpdService;
    this.playlistService = playlistService;
  }

  @RequestMapping(value = "/{name}", method = GET)
  public PlaylistInfo getPlaylist(@PathVariable("name") final String name) {
    return mpdService.getPlaylistInfo(name).orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND));
  }

  @PostMapping("/")
  public SavePlaylistResponse savePlaylist(@RequestBody SavePlaylist playlist) {
    return playlistService.savePlaylist(playlist.getPlaylistName());
  }
}
