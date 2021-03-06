package org.hihn.ampd.server.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Provides methods to manage the queue.
 */
@Service
public class QueueService {

  private static final Logger LOG = LoggerFactory.getLogger(QueueService.class);

  private final MPD mpd;

  /**
   * Service to manage the queue.
   *
   * @param mpd Represents a connection to a MPD server.
   */
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
    trackList.stream().filter(mpdSongCollection::contains).findFirst().ifPresentOrElse(
        track -> mpd.getPlayer().playSong(track),
        () -> LOG.warn("Can't play track: not found: {}", path)
    );
  }

  /**
   * Adds a saved playlist to the queue.
   *
   * @param playlist Name of the playlist to add.
   */
  public void addPlaylist(String playlist) {
    mpd.getPlaylist().loadPlaylist(playlist);
  }

  public void moveTrack(int oldPos, int newPos) {
    MPDSong track = mpd.getPlaylist().getSongList().get(oldPos);
    mpd.getPlaylist().move(track, newPos);
  }
}
