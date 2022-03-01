package org.hihn.ampd.server.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.artist.MPDArtist;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class AlbumService {

  private final MPD mpd;

  private final AmpdSettings ampdSettings;

  public AlbumService(MPD mpd, AmpdSettings ampdSettings) {
    this.mpd = mpd;
    this.ampdSettings = ampdSettings;
  }

  @Cacheable("albums")
  public Collection<MPDAlbum> listAllAlbums(int page) {
    if (page < 1) {
      return new ArrayList<>();
    }

    int counter = 1;
    int start = (page - 1) * ampdSettings.getAlbumsPageSize();
    int end = start + ampdSettings.getAlbumsPageSize() - 1;

    ArrayList<MPDAlbum> ret = new ArrayList<>();

    Collection<MPDArtist> artists = mpd.getMusicDatabase().getArtistDatabase().listAllArtists();
    for (MPDArtist artist : artists) {
      List<MPDAlbum> albums = mpd.getMusicDatabase().getAlbumDatabase().listAlbumsByArtist(artist)
          .stream()
          .filter(album -> !album.getName().isEmpty())
          .filter(album -> !album.getArtistName().isEmpty()).collect(Collectors.toList());

      for (MPDAlbum album : albums) {
        if (album.getName().contains("Black Tape")) {
          System.out.println(1);
        }
        ret.add(album);
        if (counter >= start) {
          counter += 1;
        }
        if (ret.size() == end) {
          break;
        }
      }
      if (ret.size() == end) {
        break;
      }
    }
    return ret.subList(start, end);
  }

  public Collection<MPDSong> listAlbum(String album, String artist) {
    MPDAlbum mpdAlbum = new MPDAlbum(album, artist);
    Collection<MPDSong> songs = mpd.getMusicDatabase().getSongDatabase().findAlbum(mpdAlbum);
    return songs;
  }

  public void addAlbum(MPDAlbum mpdAlbum) {
    mpd.getPlaylist().insertAlbum(mpdAlbum);
  }

  public void playAlbum(MPDAlbum mpdAlbum) {
    addAlbum(mpdAlbum);
    Optional<MPDSong> firstSong = mpd.getMusicDatabase().getSongDatabase().findAlbum(mpdAlbum)
        .stream()
        .sorted(Comparator.comparing(MPDSong::getTrack)).findFirst();
    firstSong.ifPresent(s -> mpd.getPlayer().playSong(s));
  }
}