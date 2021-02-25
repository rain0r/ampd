package org.hihn.ampd.server.message.outgoing;

import org.hihn.ampd.server.message.AmpdMessage;

public abstract class OutgoingMessage extends AmpdMessage {

  protected final MessageType type;

  protected OutgoingMessage(MessageType type) {
    this.type = type;
  }

  @Override
  public MessageType getType() {
    return type;
  }

  @Override
  public String toString() {
    return "QueueMessage{" + "payload=" + getPayload() + ", type=" + type + '}';
  }
}
