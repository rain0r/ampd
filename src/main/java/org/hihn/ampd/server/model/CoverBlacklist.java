package org.hihn.ampd.server.model;

import java.util.Set;

public class CoverBlacklist {

  private final Set<String> blacklistedFiles;

  private final String filePath;

  public CoverBlacklist(String filePath, Set<String> blacklistedFiles) {
    this.filePath = filePath;
    this.blacklistedFiles = blacklistedFiles;
  }

  public Set<String> getBlacklistedFiles() {
    return blacklistedFiles;
  }

  public String getFilePath() {
    return filePath;
  }
}
