package org.hihn.ampd.server.message.outgoing.state;

import org.hihn.ampd.server.message.AmpdMessage;

public class StateMessage extends AmpdMessage {

  private static final AmpdMessage.MESSAGE_TYPE type = AmpdMessage.MESSAGE_TYPE.STATE;

  private StatePayload payload;

  public StateMessage() {}

  @Override
  public AmpdMessage.MESSAGE_TYPE getType() {
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
