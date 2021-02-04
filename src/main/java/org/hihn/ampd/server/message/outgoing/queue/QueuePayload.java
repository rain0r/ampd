package org.hihn.ampd.server.message.outgoing.queue;


import java.util.List;
import org.bff.javampd.song.MPDSong;

public class QueuePayload {

  private final int checkSum;

  private final List<MPDSong> tracks;

  public QueuePayload(final List<MPDSong> tracks) {
    this.tracks = tracks;
    checkSum = tracks.hashCode();
  }

  public int getCheckSum() {
    return checkSum;
  }

  public List<MPDSong> getTracks() {
    return tracks;
  }
}
