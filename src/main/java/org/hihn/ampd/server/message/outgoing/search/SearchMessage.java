package org.hihn.ampd.server.message.outgoing.search;

import java.util.HashMap;
import java.util.Map;
import org.hihn.ampd.server.message.outgoing.OutgoingMessage;

/**
 * Websocket message for MPD database search results.
 */
public class SearchMessage extends OutgoingMessage {

  private final SearchPayload payload;

  public SearchMessage(final SearchPayload payload) {
    super(MessageType.SEARCH_RESULTS);
    this.payload = payload;
  }

  @Override
  public Map<String, Object> getPayload() {
    Map<String, Object> ret = new HashMap<>();
    ret.put("query", payload.getQuery());
    ret.put("searchResultCount", payload.getSearchResultCount());
    ret.put("searchResults", payload.getSearchResults());
    return ret;
  }
}
