package org.hihn.ampd.server.message.outgoing.search;

import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Websocket message for MPD database search results.
 */
public class SearchMessage extends AmpdMessage {

  private static final MESSAGE_TYPE type = MESSAGE_TYPE.SEARCH_RESULTS;

  private SearchPayload payload;

  @SuppressWarnings("checkstyle:missingjavadocmethod")
  public SearchMessage() {
  }

  @SuppressWarnings("checkstyle:missingjavadocmethod")
  public SearchMessage(SearchPayload payload) {
    this.payload = payload;
  }

  @SuppressWarnings("checkstyle:missingjavadocmethod")
  public void setPayload(SearchPayload payload) {
    this.payload = payload;
  }

  @Override
  public MESSAGE_TYPE getType() {
    return type;
  }

  @Override
  public Object getPayload() {
    return payload;
  }
}
