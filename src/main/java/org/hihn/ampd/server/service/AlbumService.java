package org.hihn.ampd.server.service;

import java.util.Collection;
import java.util.stream.Collectors;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
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

    foo.clear();
    Collection<MPDArtist> artists = mpd.getMusicDatabase().getArtistDatabase().listAllArtists();
    for (MPDArtist artist : artists) {
      foo.addAll(mpd.getMusicDatabase().getAlbumDatabase().listAlbumsByArtist(artist).stream()
          .filter(album -> !album.getName().isEmpty())
          .filter(album -> !album.getArtistName().isEmpty()).collect(Collectors.toList()));
    }

    return foo;
  }
}
