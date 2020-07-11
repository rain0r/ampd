package org.hihn.ampd.server.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SettingsBean {

  private static final Logger LOG = LoggerFactory.getLogger(SettingsBean.class);
  private final boolean localCoverCache;
  private final boolean mbCoverService;
  private final String mpdPassword;
  private final int mpdPort;
  private final String mpdServer;
  private final String musicDirectory;

  @Autowired
  public SettingsBean(@Value("${mpd.server:localhost}") String mpdServer,
      @Value("${mpd.music.directory:}") String musicDirectory,
      @Value("${mpd.port:660}") int mpdPort,
      @Value("${mpd.password:}") String mpdPassword,
      @Value("${local.cover.cache:true}") boolean localCoverCache,
      @Value("${mb.cover.service:true}") boolean mbCoverService
  ) {
    this.mpdServer = mpdServer;
    this.musicDirectory = musicDirectory;
    this.mpdPort = mpdPort;
    this.mpdPassword = mpdPassword;
    this.localCoverCache = localCoverCache;
    this.mbCoverService = mbCoverService;

    LOG.warn("mpdServer: " + mpdServer);
    LOG.warn("musicDirectory: " + musicDirectory);
    LOG.warn("mpdPort: " + mpdPort);
    LOG.warn("localCoverCache: " + localCoverCache);
    LOG.warn("mbCoverService: " + mbCoverService);
  }

  public Settings getAmpdSettings() {
    return new Settings(musicDirectory, mpdServer, mpdPort, mpdPassword, localCoverCache,
        mbCoverService);
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
