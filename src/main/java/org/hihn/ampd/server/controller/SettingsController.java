package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.model.Settings;
import org.hihn.ampd.server.service.SettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SettingsController {

  private final SettingsService settingsService;

  public SettingsController(SettingsService settingsService) {
    this.settingsService = settingsService;
  }

  @GetMapping("/settings")
  public Settings getAmpdSettings() {
    return settingsService.getAmpdSettings();
  }
}
