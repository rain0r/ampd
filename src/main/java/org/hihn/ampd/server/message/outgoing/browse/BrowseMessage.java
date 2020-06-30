package org.hihn.ampd.server.message.outgoing.browse;

import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Represents the structure of a browse message returned to the frontend. Contains the message type
 * and the payload.
 */
public class BrowseMessage extends AmpdMessage {

  private final MessageType type = MessageType.BROWSE;

  private final BrowsePayload payload;

  public BrowseMessage(BrowsePayload browsePayload) {
    this.payload = browsePayload;
  }

  @Override
  public MessageType getType() {
    return type;
  }

  @Override
  public BrowsePayload getPayload() {
    return payload;
  }
}
