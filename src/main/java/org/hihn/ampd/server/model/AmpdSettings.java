package org.hihn.ampd.server.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Represents all possible ampd settings. Can't be changed during runtime.
 */
@Component
public class AmpdSettings {

  private static final Logger LOG = LoggerFactory.getLogger(AmpdSettings.class);

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

  /**
   * When true, all active MPD modes (shuffle, consume, ...) will be turned off, when the playlist
   * is cleared.
   */
  private final boolean resetModesOnClear;

  /**
   * When true, users will be allowed to save the queue as a new playlist on the MPD server.
   */
  private final boolean createNewPlaylists;

  @Autowired
  public AmpdSettings(@Value("${mpd.server:localhost}") final String mpdServer,
      @Value("${mpd.music.directory:}") final String musicDirectory,
      @Value("${mpd.port:660}") final int mpdPort,
      @Value("${mpd.password:}") final String mpdPassword,
      @Value("${local.cover.cache:true}") final boolean localCoverCache,
      @Value("${mb.cover.service:true}") final boolean mbCoverService,
      @Value("${reset.modes.on.clear:false}") final boolean resetModesOnClear,
      @Value("${create.new.playlists:false}") final boolean createNewPlaylists) {
    this.mpdServer = mpdServer;
    this.musicDirectory = musicDirectory;
    this.mpdPort = mpdPort;
    this.mpdPassword = mpdPassword;
    this.localCoverCache = localCoverCache;
    this.mbCoverService = mbCoverService;
    this.resetModesOnClear = resetModesOnClear;
    this.createNewPlaylists = createNewPlaylists;

    LOG.debug("mpdServer: " + mpdServer);
    LOG.debug("musicDirectory: " + musicDirectory);
    LOG.debug("mpdPort: " + mpdPort);
    LOG.debug("localCoverCache: " + localCoverCache);
    LOG.debug("mbCoverService: " + mbCoverService);
    LOG.debug("resetModesOnClear: " + resetModesOnClear);
    LOG.debug("createNewPlaylists: " + createNewPlaylists);
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

  public boolean isResetModesOnClear() {
    return resetModesOnClear;
  }

  public boolean isCreateNewPlaylists() {
    return createNewPlaylists;
  }
}
