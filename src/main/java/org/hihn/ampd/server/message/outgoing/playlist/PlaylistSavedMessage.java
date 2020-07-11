package org.hihn.ampd.server.message.outgoing.playlist;

import org.hihn.ampd.server.message.AmpdMessage;

public class PlaylistSavedMessage extends AmpdMessage {

  private final PlaylistSavedPayload payload;
  private final MessageType type = MessageType.PLAYLIST_SAVED;

  public PlaylistSavedMessage(PlaylistSavedPayload payload) {
    this.payload = payload;
  }

  @Override
  public Object getPayload() {
    return payload;
  }

  @Override
  public MessageType getType() {
    return type;
  }
}
