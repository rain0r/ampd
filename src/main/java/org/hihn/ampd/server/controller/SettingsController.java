package org.hihn.ampd.server.controller;

import org.bff.javampd.server.MPD;
import org.bff.javampd.statistics.MPDStatistics;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.serializer.BackendSettings;
import org.hihn.ampd.server.service.SettingsService;
import org.hihn.ampd.server.service.cache.CoverCacheService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Endpoint to retrieve settings.
 */
@RestController
@RequestMapping("/api")
public class SettingsController {

	private final CoverCacheService coverCacheService;

	private final AmpdSettings ampdSettings;

	private final SettingsService settingsService;

	private final MPD mpd;

	/**
	 * Endpoint that provides a connection to the settings of this ampd instance.
	 * @param ampdSettings Settings of this ampd instance.
	 * @param coverCacheService Handles locally saved album art / covers.
	 * @param settingsService Provides methods of the ampd settings.
	 * @param mpd Represents a connection to an MPD server.
	 */
	public SettingsController(AmpdSettings ampdSettings, CoverCacheService coverCacheService,
			SettingsService settingsService, MPD mpd) {
		this.ampdSettings = ampdSettings;
		this.coverCacheService = coverCacheService;
		this.settingsService = settingsService;
		this.mpd = mpd;
	}

	@GetMapping("/backend")
	public List<BackendSettings> getBackendSettings() {
		return settingsService.getFields();
	}

	@GetMapping("/settings")
	public AmpdSettings getAmpdSettings() {
		return ampdSettings;
	}

	@GetMapping("/cover-disk-usage")
	public Map<String, Long> getCoverDiskUsage() {
		return Collections.singletonMap("coverDiskUsage", coverCacheService.getCoverDiskUsage());
	}

	@GetMapping("/server-statistics")
	public MPDStatistics getServerStatistics() {
		return mpd.getServerStatistics().getStatistics();
	}

	@PostMapping("/update-database")
	public void updateDatabase() {
		mpd.getAdmin().updateDatabase();
	}

	@PostMapping("/rescan-database")
	public void rescanDatabase() {
		mpd.getAdmin().rescan();
	}

}
