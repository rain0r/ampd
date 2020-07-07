package org.hihn.ampd.server.message.outgoing.queue;


import java.util.List;
import org.bff.javampd.song.MpdSong;

public class QueuePayload {

  private final List<MpdSong> tracks;

  private final int checkSum;

  public QueuePayload(List<MpdSong> tracks) {
    this.tracks = tracks;
    this.checkSum = tracks.hashCode();
  }

  public List<MpdSong> getTracks() {
    return tracks;
  }

  public int getCheckSum() {
    return checkSum;
  }
}
