package org.hihn.ampd.server.controller;

import java.util.Collections;
import java.util.Map;
import org.bff.javampd.server.MPD;
import org.bff.javampd.statistics.ServerStatistics;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.CoverBlacklist;
import org.hihn.ampd.server.service.CoverBlacklistService;
import org.hihn.ampd.server.service.CoverCacheService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint to retrieve settings and blacklist covers.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class SettingsController {

  private final CoverBlacklistService coverBlacklistService;

  private final CoverCacheService coverCacheService;

  private final AmpdSettings ampdSettingsBean;

  private final MPD mpd;

  /**
   * Endpoint that provides a connection to the settings of this ampd instance.
   *
   * @param ampdSettings          Settings of this ampd instance.
   * @param coverCacheService     Handles locally saved albumart / covers.
   * @param coverBlacklistService Handles files for which no cover should be downloaded.
   * @param mpd                   Represents a connection to a MPD server.
   */
  public SettingsController(final AmpdSettings ampdSettings,
      final CoverCacheService coverCacheService,
      final CoverBlacklistService coverBlacklistService, final MPD mpd) {
    this.ampdSettingsBean = ampdSettings;
    this.coverCacheService = coverCacheService;
    this.coverBlacklistService = coverBlacklistService;
    this.mpd = mpd;
  }

  @GetMapping("/settings")
  public AmpdSettings getAmpdSettings() {
    return ampdSettingsBean;
  }

  @GetMapping("/cover-blacklist")
  public CoverBlacklist getBlacklistedFiles() {
    return coverBlacklistService.getCoverBlacklist();
  }

  @GetMapping("/cover-disk-usage")
  public Map<String, Long> getCoverDiskUsage() {
    return Collections.singletonMap("coverDiskUsage", coverCacheService.getCoverDiskUsage());
  }

  @PostMapping("/blacklist-cover")
  public void blacklistCover(@RequestBody final String file) {
    coverBlacklistService.addFileToBlacklist(file);
  }

  @GetMapping("/server-statistics")
  public ServerStatistics getServerStatistics() {
    return mpd.getServerStatistics();
  }

  @PostMapping("/update-database")
  public void updateDatabase() {
    mpd.getAdmin().updateDatabase();
  }

  @PostMapping("/rescan-database")
  public void rescanDatabase() {
    mpd.getAdmin().rescanDatabase();
  }
}
