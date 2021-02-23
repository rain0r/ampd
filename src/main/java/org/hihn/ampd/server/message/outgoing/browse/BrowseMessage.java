package org.hihn.ampd.server.message.outgoing.browse;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.outgoing.OutgoingMessage;

/**
 * Represents the structure of a browse message returned to the frontend. Contains the message type
 * and the payload.
 */
public class BrowseMessage extends OutgoingMessage {

  private final BrowsePayload payload;

  public BrowseMessage(final BrowsePayload browsePayload) {
    super(MessageType.BROWSE);
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
}
