package org.hihn.ampd.server.message.incoming;

import java.util.Map;
import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Represents the structure of an incoming message.
 */
public class IncomingMessage extends AmpdMessage {

  private Map<String, Object> payload;

  private MessageType type;

  @Override
  public Map<String, Object> getPayload() {
    return payload;
  }

  public void setPayload(Map<String, Object> payload) {
    this.payload = payload;
  }

  @Override
  public MessageType getType() {
    return type;
  }

  public void setType(final MessageType type) {
    this.type = type;
  }

  @Override
  public String toString() {
    return "IncomingMessage{" + "payload=" + payload + ", type=" + type + '}';
  }
}
