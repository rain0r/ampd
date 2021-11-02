package org.hihn.ampd.server.controller;

import java.util.Collection;
import org.bff.javampd.album.MPDAlbum;
import org.hihn.ampd.server.service.AlbumService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AlbumController {

  private final AlbumService albumService;

  public AlbumController(AlbumService albumService) {
    this.albumService = albumService;
  }

  @GetMapping("/albums")
  public Collection<MPDAlbum> listAllAlbums() {
    return this.albumService.listAllAlbums(0, 50);
  }
}
