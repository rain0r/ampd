package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.model.Settings;
import org.hihn.ampd.server.model.SettingsBean;
import org.hihn.ampd.server.service.CoverBlacklistService;
import org.hihn.ampd.server.service.CoverCacheService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Set;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class SettingsController {

  private final CoverCacheService coverCacheService;

  private final SettingsBean settingsBean;

  private final CoverBlacklistService coverBlacklistService;

  public SettingsController(final SettingsBean settingsBean,
      final CoverCacheService coverCacheService,
      CoverBlacklistService coverBlacklistService) {
    this.settingsBean = settingsBean;
    this.coverCacheService = coverCacheService;
    this.coverBlacklistService = coverBlacklistService;
  }

  @GetMapping("/settings")
  public Settings getAmpdSettings() {
    return settingsBean.getAmpdSettings();
  }

  @GetMapping("/cover-usage")
  public Long getCoverDiskUsage() {
    return coverCacheService.getCoverDiskUsage();
  }

  @GetMapping("/cover-blacklist")
  public Set<String> getBlacklistedFiles() {
    return coverBlacklistService.getBlacklistedFiles();
  }
}
