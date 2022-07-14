package org.hihn.ampd.server.controller;

import org.bff.javampd.server.MPD;
import org.bff.javampd.statistics.MPDStatistics;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.serializer.BackendSettings;
import org.hihn.ampd.server.service.AmpdSettingsService;
import org.hihn.ampd.server.service.CoverCacheService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Endpoint to retrieve settings.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class SettingsController {

	private final CoverCacheService coverCacheService;

	private final AmpdSettings ampdSettings;

	private final AmpdSettingsService settingsService;

	private final MPD mpd;

	/**
	 * Endpoint that provides a connection to the settings of this ampd instance.
	 * @param ampdSettings Settings of this ampd instance.
	 * @param coverCacheService Handles locally saved album art / covers.
	 * @param settingsService Provides methods of the ampd settings.
	 * @param mpd Represents a connection to a MPD server.
	 */
	public SettingsController(AmpdSettings ampdSettings, CoverCacheService coverCacheService,
			AmpdSettingsService settingsService, MPD mpd) {
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
