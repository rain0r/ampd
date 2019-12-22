package org.hihn.ampd.server.message.outgoing.search;

import org.hihn.ampd.server.message.AmpdMessage;

public class SearchMessage extends AmpdMessage {

  private static final MESSAGE_TYPE type = MESSAGE_TYPE.SEARCH_RESULTS;

  private SearchPayload payload;

  public SearchMessage() {
  }

  public SearchMessage(SearchPayload payload) {
    this.payload = payload;
  }

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
