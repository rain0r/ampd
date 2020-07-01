package org.hihn.ampd.server.model;

/**
 * Represents all possible ampd settings. Can't be changed during runtime.
 */
public class Settings {

  private String musicDirectory;

  private String mpdServer;

  private int mpdPort;

  private String mpdPassword;

  private boolean localCoverCache;

  private boolean mbCoverService;

  public Settings(String musicDirectory, String mpdServer, int mpdPort,
      String mpdPassword, boolean localCoverCache, boolean mbCoverService) {
    this.musicDirectory = musicDirectory;
    this.mpdServer = mpdServer;
    this.mpdPort = mpdPort;
    this.mpdPassword = mpdPassword;
    this.localCoverCache = localCoverCache;
    this.mbCoverService = mbCoverService;
  }

  public String getMusicDirectory() {
    return musicDirectory;
  }

  public String getMpdServer() {
    return mpdServer;
  }

  public int getMpdPort() {
    return mpdPort;
  }

  public String getMpdPassword() {
    return mpdPassword;
  }

  public boolean isLocalCoverCache() {
    return localCoverCache;
  }

  public boolean isMbCoverService() {
    return mbCoverService;
  }
}
