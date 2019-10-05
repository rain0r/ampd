package org.hihn.ampd.server.message.outgoing;

import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.AmpdMessage;

import java.util.List;

public class Queue extends AmpdMessage {

  private static final AmpdMessage.MESSAGE_TYPE type = AmpdMessage.MESSAGE_TYPE.QUEUE;

  private final List<MPDSong> payload;

  public Queue(List<MPDSong> payload) {
    this.payload = payload;
  }

  @Override
  public MESSAGE_TYPE getType() {
    return type;
  }

  @Override
  public Object getPayload() {
    return payload;
  }
}
