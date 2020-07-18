package org.hihn.ampd.server.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.hihn.ampd.server.model.SettingsBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CoverBlacklistService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverBlacklistService.class);

  private final AmpdDirService ampdDirService;
  private final Set<String> blacklistedFiles = new HashSet<>();
  private final SettingsBean settingsBean;

  public CoverBlacklistService(AmpdDirService ampdDirService,
      SettingsBean settingsBean) {
    this.ampdDirService = ampdDirService;
    this.settingsBean = settingsBean;
    blacklistedFiles.addAll(loadBlacklistFile());
  }

  /**
   * Adds a file to the blacklist.
   *
   * @param file The file to add to the blacklist.
   */
  public void blacklistFile(final String file) {
    // Check if the file exists
    boolean exist = Paths.get(settingsBean.getMusicDirectory(), file).toFile().exists();
    if (exist) {
      blacklistedFiles.add(file);
      saveFile();
    }
  }

  public Set<String> getBlacklistedFiles() {
    return blacklistedFiles;
  }

  /**
   * Checks, if the blacklist contains a file.
   *
   * @param file The file to check.
   * @return If the file is in the blacklist.
   */
  public boolean isBlacklisted(final String file) {
    return blacklistedFiles.contains(file);
  }

  /**
   * Reads the blacklist file.
   *
   * @return The content of the blacklist file.
   */
  public Set<String> loadBlacklistFile() {
    Set<String> ret = new HashSet<>();
    Optional<Path> blacklistFile = ampdDirService.getBlacklistFile();
    if (blacklistFile.isEmpty()) {
      LOG.warn("Could not load or create the Musicbrainz Cover blacklist file.");
      return ret;
    }
    try (BufferedReader br = Files.newBufferedReader(blacklistFile.get())) {
      String line;
      while ((line = br.readLine()) != null) {
        ret.add(line);
      }
    } catch (IOException e) {
      LOG.error(e.getMessage(), e);
    }
    return ret;
  }

  private void saveFile() {
    if (ampdDirService.getBlacklistFile().isEmpty()) {
      return;
    }
    try {
      Files.write(ampdDirService.getBlacklistFile().get(), blacklistedFiles);
    } catch (IOException e) {
      LOG.error(e.getMessage(), e);
    }
  }
}
