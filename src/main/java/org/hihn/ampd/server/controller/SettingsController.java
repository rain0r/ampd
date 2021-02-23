package org.hihn.ampd.server.controller;

import java.util.Collections;
import java.util.Map;
import org.hihn.ampd.server.model.CoverBlacklist;
import org.hihn.ampd.server.model.Settings;
import org.hihn.ampd.server.service.CoverBlacklistService;
import org.hihn.ampd.server.service.CoverCacheService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class SettingsController {

  private final CoverBlacklistService coverBlacklistService;

  private final CoverCacheService coverCacheService;

  private final Settings settingsBean;

  public SettingsController(final Settings settingsBean,
      final CoverCacheService coverCacheService,
      final CoverBlacklistService coverBlacklistService) {
    this.settingsBean = settingsBean;
    this.coverCacheService = coverCacheService;
    this.coverBlacklistService = coverBlacklistService;
  }

  @GetMapping("/settings")
  public Settings getAmpdSettings() {
    return settingsBean;
  }

  @GetMapping("/cover-blacklist")
  public CoverBlacklist getBlacklistedFiles() {
    return coverBlacklistService.getCoverBlacklist();
  }

  @GetMapping("/cover-disk-usage")
  public Map<String, Long> getCoverDiskUsage() {
    return Collections.singletonMap("coverDiskUsage", coverCacheService.getCoverDiskUsage());
  }
}
