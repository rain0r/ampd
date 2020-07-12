package org.hihn.ampd.server.message.outgoing.search;

import java.util.List;
import org.bff.javampd.song.MpdSong;

/**
 * Represents the structure of the search payload returned to the frontend.
 */
public class SearchPayload {

  private String query;

  private int searchResultCount;

  private List<MpdSong> searchResults;

  public SearchPayload(final List<MpdSong> searchResults, final int searchResultCount,
      final String query) {
    this.searchResults = searchResults;
    this.searchResultCount = searchResultCount;
    this.query = query;
  }

  public String getQuery() {
    return query;
  }

  public void setQuery(final String query) {
    this.query = query;
  }

  public int getSearchResultCount() {
    return searchResultCount;
  }

  public void setSearchResultCount(final int searchResultCount) {
    this.searchResultCount = searchResultCount;
  }

  public List<MpdSong> getSearchResults() {
    return searchResults;
  }

  public void setSearchResults(final List<MpdSong> searchResults) {
    this.searchResults = searchResults;
  }
}
