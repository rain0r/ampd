package org.hihn.ampd.server.service;

import org.hihn.ampd.server.model.Settings;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

  @Value("${mpd.music.directory:}")
  private String musicDirectory;

  @Value("${mpd.server:localhost}")
  private String mpdServer;

  @Value("${mpd.port:6600}")
  private String mpdPort;

  @Value("${mpd.password:}")
  private String mpdPassword;

  @Value("${local.cover.cache:true}")
  private boolean localCoverCache;

  @Value("${mb.cover.service:true}")
  private boolean mbCoverService;

  public Settings getAmpdSettings() {
    return new Settings(musicDirectory, mpdServer, mpdPort, mpdPassword,
        localCoverCache,
        mbCoverService);
  }
}
