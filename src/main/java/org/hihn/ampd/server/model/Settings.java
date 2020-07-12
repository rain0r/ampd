package org.hihn.ampd.server.model;

/**
 * Represents all possible ampd settings. Can't be changed during runtime.
 */
public class Settings {

  private final boolean localCoverCache;

  private final boolean mbCoverService;

  private final String mpdPassword;

  private final int mpdPort;

  private final String mpdServer;

  private final String musicDirectory;

  public Settings(final String musicDirectory, final String mpdServer, final int mpdPort,
      final String mpdPassword, final boolean localCoverCache, final boolean mbCoverService) {
    this.musicDirectory = musicDirectory;
    this.mpdServer = mpdServer;
    this.mpdPort = mpdPort;
    this.mpdPassword = mpdPassword;
    this.localCoverCache = localCoverCache;
    this.mbCoverService = mbCoverService;
  }

  public String getMpdPassword() {
    return mpdPassword;
  }

  public int getMpdPort() {
    return mpdPort;
  }

  public String getMpdServer() {
    return mpdServer;
  }

  public String getMusicDirectory() {
    return musicDirectory;
  }

  public boolean isLocalCoverCache() {
    return localCoverCache;
  }

  public boolean isMbCoverService() {
    return mbCoverService;
  }
}
