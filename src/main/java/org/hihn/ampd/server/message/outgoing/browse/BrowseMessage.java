package org.hihn.ampd.server.message.outgoing.browse;

import org.hihn.ampd.server.message.AmpdMessage;

public class BrowseMessage extends AmpdMessage {

  private final AmpdMessage.MESSAGE_TYPE type = MESSAGE_TYPE.BROWSE;

  private final BrowsePayload payload;

  public BrowseMessage(BrowsePayload browsePayload) {
    this.payload = browsePayload;
  }

  @Override
  public MESSAGE_TYPE getType() {
    return type;
  }

  @Override
  public BrowsePayload getPayload() {
    return payload;
  }

}
