package org.hihn.ampd.server.message.outgoing.search;

import java.util.List;
import org.bff.javampd.song.MPDSong;

public class SearchPayload {

  List<MPDSong> searchResults = null;

  int searchResultCount = 0;

  String query = null;

  public SearchPayload() {
  }

  public SearchPayload(List<MPDSong> searchResults, int searchResultCount, String query) {
    this.searchResults = searchResults;
    this.searchResultCount = searchResultCount;
    this.query = query;
  }

  public List<MPDSong> getSearchResults() {
    return searchResults;
  }

  public void setSearchResults(List<MPDSong> searchResults) {
    this.searchResults = searchResults;
  }

  public int getSearchResultCount() {
    return searchResultCount;
  }

  public void setSearchResultCount(int searchResultCount) {
    this.searchResultCount = searchResultCount;
  }

  public String getQuery() {
    return query;
  }

  public void setQuery(String query) {
    this.query = query;
  }
}
