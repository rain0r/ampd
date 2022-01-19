package org.hihn.ampd.server.service;

import java.util.Collection;
import java.util.stream.Collectors;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.server.MPD;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

  private final MPD mpd;

  public AlbumService(MPD mpd) {
    this.mpd = mpd;
  }

  public Collection<MPDAlbum> listAllAlbums(int start, int end) {
    Collection<MPDAlbum> foo = mpd.getMusicDatabase().getAlbumDatabase().listAllAlbums().stream()
        .filter(album -> !album.getName().isEmpty())
        .filter(album -> !album.getArtistName().isEmpty()).collect(Collectors.toList());
    return foo;
  }
}
