package org.hihn.ampd.server.message.outgoing.state;

import org.hihn.ampd.server.message.AmpdMessage;

public class StateMessage extends AmpdMessage {

  private static final MessageType type = MessageType.STATE;

  private StatePayload payload;

  public StateMessage(StatePayload payload) {
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

  public void setPayload(StatePayload payload) {
    this.payload = payload;
  }
}
