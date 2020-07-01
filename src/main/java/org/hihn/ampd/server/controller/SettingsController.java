package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.model.Settings;
import org.hihn.ampd.server.model.SettingsBean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SettingsController {

  private final SettingsBean settingsBean;

  public SettingsController(SettingsBean settingsBean) {
    this.settingsBean = settingsBean;
  }


  @GetMapping("/settings")
  public Settings getAmpdSettings() {
    return settingsBean.getAmpdSettings();
  }
}
