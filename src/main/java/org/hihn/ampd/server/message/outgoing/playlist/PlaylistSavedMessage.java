package org.hihn.ampd.server.message.outgoing.playlist;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.AmpdMessage;

public class PlaylistSavedMessage extends AmpdMessage {

  private final PlaylistSavedPayload payload;

  private final MessageType type = MessageType.PLAYLIST_SAVED;

  public PlaylistSavedMessage(final PlaylistSavedPayload payload) {
    this.payload = payload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("playlistName", payload.getPlaylistName());
    ret.put("success", payload.isSuccess());
    return ret;
  }

  @Override
  public MessageType getType() {
    return type;
  }
}
