package org.hihn.ampd.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Handles access to the ampd dir. Usually, ~/.local/share/ampd/.
 */
@Service
public class AmpdDirService {

	/**
	 * Name of the dir that holds all covers.
	 */
	private static final String CACHE_DIR_NAME = "covers";

	private static final String DB_NAME = "ampd";

	private static final Logger LOG = LoggerFactory.getLogger(AmpdDirService.class);

	private final Path ampdHomeDir;

	public AmpdDirService() {
		ampdHomeDir = Paths.get(System.getProperty("user.home"), ".local", "share", "ampd");
		if (!Files.exists(ampdHomeDir) && !new File(ampdHomeDir.toString()).mkdirs()) {
			LOG.warn("Could not create ampd home-dir: {}. This is not fatal, "
					+ "it just means, we can't save or load covers to the local cache.", ampdHomeDir);
		}
	}

	/**
	 * Returns the path of the ampd cache directory. Creates it, if it doesn't exist.
	 * @return The path of the cache dir.
	 */
	public Path getCacheDir() {
		return Paths.get(ampdHomeDir.toString(), CACHE_DIR_NAME);
	}

	public Path getDbPath() {
		return Paths.get(ampdHomeDir.toString(), DB_NAME);
	}

	public Path getAmpdHomeDir() {
		return ampdHomeDir;
	}

}
