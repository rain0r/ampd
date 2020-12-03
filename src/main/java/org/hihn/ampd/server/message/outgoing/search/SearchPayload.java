package org.hihn.ampd.server.message.outgoing.search;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.bff.javampd.song.MpdSong;

/**
 * Represents the structure of the search payload returned to the frontend.
 */
public class SearchPayload {

  private final String query;

  private final int searchResultCount;

  private final List<MpdSong> searchResults = new ArrayList<>();

  public SearchPayload(Collection<MpdSong> songs, String query) {
    searchResults.addAll(songs);
    searchResultCount = songs.size();
    this.query = query;
  }

  public String getQuery() {
    return query;
  }

  public int getSearchResultCount() {
    return searchResultCount;
  }

  public List<MpdSong> getSearchResults() {
    return searchResults;
  }
}
