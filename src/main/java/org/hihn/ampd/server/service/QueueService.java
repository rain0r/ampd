package org.hihn.ampd.server.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.controller.ws.QueueController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Provides methods to manage the queue.
 */
@Service
public class QueueService {

  private static final Logger LOG = LoggerFactory.getLogger(QueueController.class);

  private final MPD mpd;

  public QueueService(final MPD mpd) {
    this.mpd = mpd;
  }

  /**
   * Adds a track to the queue.
   *
   * @param file The path of the track.
   */
  public void addTrack(String file) {
    mpd.getPlaylist().addSong(file);
  }

  /**
   * Adds  tracks to the queue.
   *
   * @param tracks The path of the tracks.
   */
  public void addTracks(ArrayList<String> tracks) {
    mpd.getPlaylist()
        .addSongs(
            tracks.stream().map(track -> new MPDSong(track, "")).collect(Collectors.toList()));
  }

  /**
   * Plays a track.
   *
   * @param path The path of the track.
   */
  public void playTrack(String path) {
    List<MPDSong> trackList = mpd.getPlaylist().getSongList();
    Collection<MPDSong> mpdSongCollection =
        mpd.getMusicDatabase().getSongDatabase().searchFileName(path);
    List<MPDSong> result =
        trackList.stream().filter(mpdSongCollection::contains).collect(Collectors.toList());
    if (result.size() > 0) {
      mpd.getPlayer().playSong(result.iterator().next());
    } else {
      LOG.warn("Track not found: " + path);
    }
  }

  public void addPlaylist(String playlist) {
    Collection<MPDSong> mpdSongCollection =
        mpd.getMusicDatabase().getPlaylistDatabase().listPlaylistSongs(playlist);
    ArrayList<MPDSong> mpdTracks = new ArrayList<>(mpdSongCollection);
    mpd.getPlaylist().addSongs(mpdTracks);
  }
}
