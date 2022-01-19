package org.hihn.ampd.server.model;

import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
  @Value("${local.cover.cache:true}")
  private boolean localCoverCache;

  /**
   * If true, covers that couldn't be found in the directory of the track will be downloaded from
   * MusicBrainz.
   */
  @Value("${mb.cover.service:true}")
  private boolean mbCoverService;

  /**
   * The password needed to access the MPD server. Optional.
   */
  @Value("${mpd.password:}")
  private String mpdPassword;

  /**
   * The port needed to access the MPD server. Default 6600.
   */
  @Value("${mpd.port:660}")
  private int mpdPort;

  /**
   * The name or ip of the computer running the MPD server.
   */
  @Value("${mpd.server:localhost}")
  private String mpdServer;

  /**
   * The directory where all the tracks are stored. This setting is needed for ampd to display the
   * covers that usually lie in the direcotry of the tracks.
   */
  @Value("${mpd.music.directory:}")
  private String musicDirectory;

  /**
   * When true, all active MPD modes (shuffle, consume, ...) will be turned off, when the playlist
   * is cleared.
   */
  @Value("${reset.modes.on.clear:false}")
  private boolean resetModesOnClear;

  /**
   * When true, users will be allowed to save the queue as a new playlist on the MPD server.
   */
  @Value("${create.new.playlists:false}")
  private boolean createNewPlaylists;

  /**
   * When true, users will be allowed to delete existing playlists on the MPD server.
   */
  @Value("${delete.existing.playlists:false}")
  private boolean deleteExistingPlaylists;

  /**
   * Strictness of the cover-search. A low will propably load wrong cover.
   */
  @Value("${min.score:75}")
  private int minScore;

  /**
   * Artwork finder: filename pattern for glob.
   */
  @Value("${artwork.filename.pattern}")
  private String artworkFilenamePattern;

  /**
   * Version of ampd as specified in pom.xml.
   */
  @Value("${application.version}")
  private String applicationVersion;

  @Value("${albums.page.size:30}")
  private int albumsPageSize;

  /**
   * Prints the applied properties to the console.
   */
  @PostConstruct
  public void init() {
    LOG.debug("mpdServer: {}", mpdServer);
    LOG.debug("musicDirectory: {}", musicDirectory);
    LOG.debug("mpdPort: {}", mpdPort);
    LOG.debug("localCoverCache: {}", localCoverCache);
    LOG.debug("mbCoverService: {}", mbCoverService);
    LOG.debug("resetModesOnClear: {}", resetModesOnClear);
    LOG.debug("createNewPlaylists: {}", createNewPlaylists);
    LOG.debug("deleteExistingPlaylists: {}", deleteExistingPlaylists);
    LOG.debug("minScore: {}", minScore);
    LOG.debug("artworkFilenamePattern: {}", artworkFilenamePattern);
    LOG.debug("applicationVersion: {}", applicationVersion);
    LOG.debug("albumsPageSize: {}", albumsPageSize);
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

  public boolean isDeleteExistingPlaylists() {
    return deleteExistingPlaylists;
  }

  public int getMinScore() {
    return minScore;
  }

  public String getArtworkFilenamePattern() {
    return artworkFilenamePattern;
  }

  public String getApplicationVersion() {
    return applicationVersion;
  }

  public int getAlbumsPageSize() {
    return albumsPageSize;
  }
}
