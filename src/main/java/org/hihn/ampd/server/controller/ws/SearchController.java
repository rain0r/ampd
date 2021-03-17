package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.server.MPD;
import org.bff.javampd.song.SongSearcher.ScopeType;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.outgoing.SearchPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * Provides an endpoint to search the MPD library.
 */
@Controller
@MessageMapping("/search")
public class SearchController {

  private static final Logger LOG = LoggerFactory.getLogger(SearchController.class);

  private final MPD mpd;

  public SearchController(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  /**
   * Receives a search term and processes it.
   *
   * @param searchTerm The term to search for.
   * @return A {@link SearchPayload}-object contain
   */
  @MessageMapping("/")
  @SendTo("/topic/search")
  public SearchPayload search(@Payload String searchTerm) {
    return searchDatabase(searchTerm);
  }

  /**
   * Takes a search-term and searches the MPD database for it.
   *
   * @param query The term to search for.
   * @return A payload with the search results.
   */
  private SearchPayload searchDatabase(String query) {
    return new SearchPayload(mpd.getSongSearcher().search(ScopeType.ANY, query.trim()),
        query.trim());
  }
}
