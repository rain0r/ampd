package org.hihn.ampd.server.message.outgoing.queue;

import java.util.List;
import org.bff.javampd.song.MPDSong;

public class QueuePayload {

  private final List<MPDSong> tracks;

  private final int checkSum;

  public QueuePayload(List<MPDSong> tracks) {
    this.tracks = tracks;
    this.checkSum = tracks.hashCode();
  }

  public List<MPDSong> getTracks() {
    return tracks;
  }

  public int getCheckSum() {
    return checkSum;
  }
}
