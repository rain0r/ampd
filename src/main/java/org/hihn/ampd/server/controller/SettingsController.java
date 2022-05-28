package org.hihn.ampd.server.controller;

import org.bff.javampd.server.MPD;
import org.bff.javampd.statistics.ServerStatistics;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.service.CoverCacheService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

/**
 * Endpoint to retrieve settings.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin
public class SettingsController {

	private final CoverCacheService coverCacheService;

	private final AmpdSettings ampdSettingsBean;

	private final MPD mpd;

	/**
	 * Endpoint that provides a connection to the settings of this ampd instance.
	 * @param ampdSettings Settings of this ampd instance.
	 * @param coverCacheService Handles locally saved album art / covers.
	 * @param mpd Represents a connection to a MPD server.
	 */
	public SettingsController(final AmpdSettings ampdSettings, final CoverCacheService coverCacheService,
			final MPD mpd) {
		this.ampdSettingsBean = ampdSettings;
		this.coverCacheService = coverCacheService;
		this.mpd = mpd;
	}

	@GetMapping("/settings")
	public AmpdSettings getAmpdSettings() {
		return ampdSettingsBean;
	}

	@GetMapping("/cover-disk-usage")
	public Map<String, Long> getCoverDiskUsage() {
		return Collections.singletonMap("coverDiskUsage", coverCacheService.getCoverDiskUsage());
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
		mpd.getAdmin().rescan();
	}

}
