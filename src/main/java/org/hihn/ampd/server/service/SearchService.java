package org.hihn.ampd.server.service;

import java.util.ArrayList;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.bff.javampd.song.SongSearcher.ScopeType;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.outgoing.search.SearchMessage;
import org.hihn.ampd.server.message.outgoing.search.SearchPayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SearchService {

  private final MPD mpd;

  @Autowired
  public SearchService(MpdConfiguration mpdConfiguration) {
    this.mpd = mpdConfiguration.mpd();
  }

  public SearchMessage search(String query) {
    ArrayList<MPDSong> searchResults = new ArrayList<>();
    searchResults.addAll(mpd.getSongSearcher().search(ScopeType.ANY, query));

    SearchMessage searchResult =
        new SearchMessage(new SearchPayload(searchResults, searchResults.size(), query));
    return searchResult;
  }
}
