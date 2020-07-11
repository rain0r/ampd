package org.hihn.ampd.server.message.outgoing.browse;

import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Represents the structure of a browse message returned to the frontend. Contains the message type
 * and the payload.
 */
public class BrowseMessage extends AmpdMessage {

  private final BrowsePayload payload;
  private final MessageType type = MessageType.BROWSE;

  public BrowseMessage(BrowsePayload browsePayload) {
    payload = browsePayload;
  }

  @Override
  public BrowsePayload getPayload() {
    return payload;
  }

  @Override
  public MessageType getType() {
    return type;
  }
}
