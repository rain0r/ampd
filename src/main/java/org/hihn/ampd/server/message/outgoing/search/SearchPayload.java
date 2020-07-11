package org.hihn.ampd.server.message.outgoing.search;

import java.util.List;
import org.bff.javampd.song.MpdSong;

/**
 * Represents the structure of the search payload returned to the frontend.
 */
public class SearchPayload {

  String query = null;
  int searchResultCount = 0;
  List<MpdSong> searchResults = null;

  public SearchPayload() {
  }

  public SearchPayload(List<MpdSong> searchResults, int searchResultCount, String query) {
    this.searchResults = searchResults;
    this.searchResultCount = searchResultCount;
    this.query = query;
  }

  public String getQuery() {
    return query;
  }

  public void setQuery(String query) {
    this.query = query;
  }

  public int getSearchResultCount() {
    return searchResultCount;
  }

  public void setSearchResultCount(int searchResultCount) {
    this.searchResultCount = searchResultCount;
  }

  public List<MpdSong> getSearchResults() {
    return searchResults;
  }

  public void setSearchResults(List<MpdSong> searchResults) {
    this.searchResults = searchResults;
  }
}
