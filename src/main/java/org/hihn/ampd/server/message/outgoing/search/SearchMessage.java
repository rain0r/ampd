package org.hihn.ampd.server.message.outgoing.search;

import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Websocket message for MPD database search results.
 */
public class SearchMessage extends AmpdMessage {

  private static final MessageType type = MessageType.SEARCH_RESULTS;

  private SearchPayload payload;

  public SearchMessage() {
  }

  public SearchMessage(SearchPayload payload) {
    this.payload = payload;
  }

  @Override
  public Object getPayload() {
    return payload;
  }

  public void setPayload(SearchPayload payload) {
    this.payload = payload;
  }

  @Override
  public MessageType getType() {
    return type;
  }
}
