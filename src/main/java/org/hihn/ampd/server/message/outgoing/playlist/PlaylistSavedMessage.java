package org.hihn.ampd.server.message.outgoing.playlist;

import org.hihn.ampd.server.message.AmpdMessage;

public class PlaylistSavedMessage extends AmpdMessage {

  private final MessageType type = MessageType.PLAYLIST_SAVED;

  private final PlaylistSavedPayload payload;

  public PlaylistSavedMessage(PlaylistSavedPayload payload) {
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
}
