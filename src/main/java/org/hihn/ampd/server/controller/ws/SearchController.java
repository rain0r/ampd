package org.hihn.ampd.server.controller.ws;

import org.bff.javampd.server.MPD;
import org.bff.javampd.song.SongSearcher.ScopeType;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.outgoing.search.SearchMessage;
import org.hihn.ampd.server.message.outgoing.search.SearchPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SearchController {

  private static final Logger LOG = LoggerFactory.getLogger(SearchController.class);

  private static final String PATH = "/search";

  private final MPD mpd;

  public SearchController(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  @MessageMapping(PATH)
  @SendTo("/topic" + PATH)
  public SearchMessage search(@Payload String searchTerm) {
    LOG.debug("Got search term: {}", searchTerm);
    LOG.debug("Results: {}", searchDatabase(searchTerm));
    return searchDatabase(searchTerm);
  }


  /**
   * Takes a query and searches the MPD database for it.
   *
   * @param query What to search for.
   * @return A message with the search results.
   */
  private SearchMessage searchDatabase(String query) {
    return new SearchMessage(
        new SearchPayload(mpd.getSongSearcher().search(ScopeType.ANY, query.trim()), query.trim()));
  }
}
