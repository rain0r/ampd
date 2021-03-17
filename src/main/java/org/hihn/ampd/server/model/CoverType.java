package org.hihn.ampd.server.model;

/**
 * Model to distinguish between an album cover and track cover.
 */
public enum CoverType {
  ALBUM("a_"),
  SINGLETON("s_");

  private final String prefix;

  CoverType(final String prefix) {
    this.prefix = prefix;
  }

  public String getPrefix() {
    return prefix;
  }
}
