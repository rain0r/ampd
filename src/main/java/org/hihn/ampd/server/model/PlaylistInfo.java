package org.hihn.ampd.server.model;

import java.util.Collection;
import org.bff.javampd.song.MpdSong;

/**
 * Holds information about a saved playlist.
 */
public class PlaylistInfo {

  private String name;

  private int trackCount;

  private Collection<MpdSong> tracks;

  public PlaylistInfo(String name, int trackCount,
      Collection<MpdSong> tracks) {
    this.name = name;
    this.trackCount = trackCount;
    this.tracks = tracks;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getTrackCount() {
    return trackCount;
  }

  public void setTrackCount(int trackCount) {
    this.trackCount = trackCount;
  }

  public Collection<MpdSong> getTracks() {
    return tracks;
  }

  public void setTracks(Collection<MpdSong> tracks) {
    this.tracks = tracks;
  }
}
