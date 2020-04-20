package org.hihn.ampd.server.message.incoming;

import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Represents the structure of an incoming message.
 */
public class IncomingMessage extends AmpdMessage {

  private Object payload = null;

  private MessageType type = null;

  @Override
  public Object getPayload() {
    return payload;
  }

  public void setPayload(Object payload) {
    this.payload = payload;
  }

  @Override
  public MessageType getType() {
    return type;
  }

  public void setType(MessageType type) {
    this.type = type;
  }

  @Override
  public String toString() {
    return "IncomingMessage{" + "payload=" + payload + ", type=" + type + '}';
  }
}
