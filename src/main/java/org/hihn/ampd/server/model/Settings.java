package org.hihn.ampd.server.model;

/**
 * Represents all possible ampd settings. Can't be changed during runtime.
 */
public class Settings {

  /**
   * If true, covers that have been downloaded from MusicBrainz will be saved to disk and used the
   * next time the cached cover will be displayed.
   */
  private final boolean localCoverCache;

  /**
   * If true, covers that couldn't be found in the directory of the track will be downloaded from
   * MusicBrainz.
   */
  private final boolean mbCoverService;

  /**
   * The password needed to access the MPD server. Optional.
   */
  private final String mpdPassword;

  /**
   * The port needed to access the MPD server. Default 6600.
   */
  private final int mpdPort;

  /**
   * The name or ip of the computer running the MPD server.
   */
  private final String mpdServer;

  /**
   * The directory where all the tracks are stored. This setting is needed for ampd to display the
   * covers that usually lie in the direcotry of the tracks.
   */
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
