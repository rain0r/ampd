package org.hihn.ampd.server.message.outgoing.playlist;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.outgoing.OutgoingMessage;

public class PlaylistSavedMessage extends OutgoingMessage {

  private final PlaylistSavedPayload payload;

  public PlaylistSavedMessage(final PlaylistSavedPayload payload) {
    super(MessageType.PLAYLIST_SAVED);
    this.payload = payload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("playlistName", payload.getPlaylistName());
    ret.put("success", payload.isSuccess());
    return ret;
  }
}
