package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.model.CoverBlacklist;
import org.hihn.ampd.server.model.Settings;
import org.hihn.ampd.server.service.CoverBlacklistService;
import org.hihn.ampd.server.service.CoverCacheService;
import org.hihn.ampd.server.service.SettingsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class SettingsController {

    private final CoverBlacklistService coverBlacklistService;

    private final CoverCacheService coverCacheService;

    private final SettingsService settingsService;

    private final Settings settingsBean;

    public SettingsController(final Settings settingsBean,
                              final CoverCacheService coverCacheService,
                              final SettingsService settingsService,
                              final CoverBlacklistService coverBlacklistService) {
        this.settingsBean = settingsBean;
        this.coverCacheService = coverCacheService;
        this.settingsService = settingsService;
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
        // return coverCacheService.getCoverDiskUsage();
    }

    @GetMapping("/backend-address")
    public Map<String, String> getBackendAddress() {
        Map<String, String> addr = Map.of(
                "backendAddress", settingsService.getBackendAddress(),
                "webSocketAddress", settingsService.getWebSocketAddress()
        );
        return addr;
    }
}
