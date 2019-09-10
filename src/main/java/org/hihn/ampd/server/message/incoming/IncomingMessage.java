package org.hihn.ampd.server.message.incoming;

import org.hihn.ampd.server.message.AmpdMessage;

public class IncomingMessage extends AmpdMessage {

  private Object payload = null;

  private AmpdMessage.MESSAGE_TYPE type = null;

  @Override
  public Object getPayload() {
    return payload;
  }

  public void setPayload(Object payload) {
    this.payload = payload;
  }

  @Override
  public MESSAGE_TYPE getType() {
    return type;
  }

  public void setType(MESSAGE_TYPE type) {
    this.type = type;
  }

  @Override
  public String toString() {
    return "IncomingMessage{" + "payload=" + payload + ", type=" + type + '}';
  }
}
