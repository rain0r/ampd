package org.hihn.ampd.server.message.outgoing.state;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.AmpdMessage;

public class StateMessage extends AmpdMessage {

  private static final MessageType type = MessageType.STATE;

  private StatePayload payload;

  public StateMessage(final StatePayload payload) {
    this.payload = payload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("controlPanel", payload.getControlPanel());
    ret.put("cover", payload.getCover());
    ret.put("currentSong", payload.getCurrentSong());
    ret.put("serverStatus", payload.getServerStatus());
    return ret;
  }

  public void setPayload(final StatePayload payload) {
    this.payload = payload;
  }

  @Override
  public MessageType getType() {
    return type;
  }
}
