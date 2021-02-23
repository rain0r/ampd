package org.hihn.ampd.server.message.outgoing.queue;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.outgoing.OutgoingMessage;

public class QueueMessage extends OutgoingMessage {

  private final QueuePayload payload;

  public QueueMessage(final QueuePayload payload) {
    super(MessageType.QUEUE);
    this.payload = payload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("checkSum", payload.getCheckSum());
    ret.put("tracks", payload.getTracks());
    return ret;
  }

}
