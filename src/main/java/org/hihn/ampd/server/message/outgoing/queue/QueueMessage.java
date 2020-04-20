package org.hihn.ampd.server.message.outgoing.queue;

import org.hihn.ampd.server.message.AmpdMessage;

public class QueueMessage extends AmpdMessage {

  private static final MessageType type = MessageType.QUEUE;

  private final QueuePayload payload;

  public QueueMessage(QueuePayload payload) {
    this.payload = payload;
  }

  @Override
  public MessageType getType() {
    return type;
  }

  @Override
  public Object getPayload() {
    return payload;
  }


}
