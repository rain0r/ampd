package org.hihn.ampd.server.message.outgoing.search;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.AmpdMessage;

/**
 * Websocket message for MPD database search results.
 */
public class SearchMessage extends AmpdMessage {

  private static final MessageType type = MessageType.SEARCH_RESULTS;

  private final SearchPayload payload;

  public SearchMessage(final SearchPayload payload) {
    this.payload = payload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("query", payload.getQuery());
    ret.put("searchResultCount", payload.getQuery());
    ret.put("searchResults", payload.getQuery());
    return ret;
  }

  @Override
  public MessageType getType() {
    return type;
  }
}
