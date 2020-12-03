package org.hihn.ampd.server.message.outgoing.browse;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Represents the structure of a browse message returned to the frontend. Contains the message type
 * and the payload.
 */
public class BrowseMessage extends AmpdMessage {

  private final BrowsePayload payload;

  private final MessageType type = MessageType.BROWSE;

  public BrowseMessage(final BrowsePayload browsePayload) {
    payload = browsePayload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("directories", payload.getDirectories());
    ret.put("playlists", payload.getPlaylists());
    ret.put("tracks", payload.getTracks());
    return ret;
  }

  @Override
  public MessageType getType() {
    return type;
  }
}
