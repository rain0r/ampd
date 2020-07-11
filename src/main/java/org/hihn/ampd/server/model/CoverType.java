package org.hihn.ampd.server.model;

public enum CoverType {
  ALBUM("a_"),
  SINGLETON("s_");

  private final String prefix;

  CoverType(String prefix) {
    this.prefix = prefix;
  }

  public String getPrefix() {
    return prefix;
  }
}
