package org.hihn.ampd.server.message.outgoing.queue;


import java.util.List;
import org.bff.javampd.song.MpdSong;

public class QueuePayload {

  private final int checkSum;
  private final List<MpdSong> tracks;

  public QueuePayload(List<MpdSong> tracks) {
    this.tracks = tracks;
    checkSum = tracks.hashCode();
  }

  public int getCheckSum() {
    return checkSum;
  }

  public List<MpdSong> getTracks() {
    return tracks;
  }
}
