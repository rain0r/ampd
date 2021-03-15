package org.hihn.ampd.server.message.outgoing.state;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.outgoing.OutgoingMessage;

public class StateMessage extends OutgoingMessage {

  private StatePayload payload;

  public StateMessage(final StatePayload payload) {
    super(MessageType.STATE);
    this.payload = payload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("controlPanel", payload.getMpdModesPanel());
    ret.put("cover", payload.getCover());
    ret.put("currentTrack", payload.getCurrentTrack());
    ret.put("serverStatus", payload.getServerStatus());
    return ret;
  }

  public void setPayload(final StatePayload payload) {
    this.payload = payload;
  }
}
