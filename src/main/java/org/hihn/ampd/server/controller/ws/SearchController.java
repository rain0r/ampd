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

public class SearchController {

  private static final Logger LOG = LoggerFactory.getLogger(SearchController.class);

  public static final String CONTROL_PANEL_PATH = "/search";

  private final MPD mpd;

  public SearchController(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();

  }

  @MessageMapping(CONTROL_PANEL_PATH)
  @SendTo("/topic" + CONTROL_PANEL_PATH)
  public void search(@Payload String searchTerm) {
    LOG.debug("Got messageType: {}", searchTerm);
    searchDatabase(searchTerm);
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
