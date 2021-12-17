package org.hihn.ampd.server.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Handles access to the ampd dir. Usually, ~/.local/share/ampd/.
 */
@Service
public class AmpdDirService {

  /**
   * Name of the dir that holds all covers.
   */
  private static final String CACHE_DIR_NAME = "covers";

  private static final Logger LOG = LoggerFactory.getLogger(AmpdDirService.class);

  /**
   * Returns the path of the ampd cache directory. Creates it, if it doesn't exist.
   *
   * @return The path of the cache dir.
   */
  public Optional<Path> getCacheDir() {
    final Path cacheDirPath = Paths
        .get(System.getProperty("user.home"), ".local", "share", "ampd", CACHE_DIR_NAME);
    if (!Files.exists(cacheDirPath) && !new File(cacheDirPath.toString()).mkdirs()) {
      LOG.warn(
          "Could not create ampd home-dir: {}. This is not fatal, "
              + "it just means, we can't save or load covers to the local cache.",
          cacheDirPath);
      return Optional.empty();
    }
    return Optional.of(cacheDirPath);
  }
}

