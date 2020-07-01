package org.hihn.ampd.server.service;

import static org.hihn.ampd.server.util.AmpdUtils.loadFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import org.hihn.ampd.server.model.CoverType;
import org.hihn.ampd.server.model.SettingsBean;
import org.hihn.ampd.server.util.AmpdUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Handles the caching of album art.
 */
@Service
public class CoverCacheService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverCacheService.class);

  private final SettingsBean settingsBean;

  private Optional<Path> chacheDir;

  /**
   * Name of the dir that holds all covers
   */
  private static final String CACHE_DIR = "covers";

  public CoverCacheService(SettingsBean settingsBean) {
    this.settingsBean = settingsBean;
  }

  /**
   * Loads a cover from the local cache.
   *
   * @param coverType    The type of the cover.
   * @param artist       Artist to which the cover is associated.
   * @param titleOrAlbum Are we looking for the cover of an album or single track.
   * @return An optional with the bytes of the found cover in a successful case.
   */
  public Optional<byte[]> loadCover(CoverType coverType, String artist, String titleOrAlbum) {
    if (!this.useCache()) {
      return Optional.empty();
    }

    String fileName = buildFileName(coverType, artist, titleOrAlbum);
    Path fullPath = Paths.get(this.chacheDir.get().toString(), CACHE_DIR, fileName)
        .toAbsolutePath();
    try {
      return Optional.of(loadFile(fullPath));
    } catch (Exception e) {
      return Optional.empty();
    }
  }

  /**
   * Saves a given cover to the local cache.
   *
   * @param coverType    The type of the cover.
   * @param artist       Artist to which the cover is associated.
   * @param titleOrAlbum Is this the cover of an album or a single track.
   * @param file         The cover itself.
   */
  public void saveCover(CoverType coverType, String artist, String titleOrAlbum, byte[] file) {
    if (!this.useCache()) {
      return;
    }

    try {
      String fileName = buildFileName(coverType, artist, titleOrAlbum);
      Path fullPath = Paths.get(this.chacheDir.get().toString(), fileName).toAbsolutePath();

      // Don't write the file if it already exists
      if (!fullPath.toFile().exists()) {
        LOG.debug("Saving cover. coverType: {}, artist: {}, title: {}", coverType, artist,
            titleOrAlbum);
        Files.write(fullPath, file);
      }
    } catch (IOException e) {
      LOG.warn("Failed to save cover to local cache: {}", e.getMessage());
    }
  }

  /**
   * Reads a track from disk.
   *
   * @param trackFilePath The path of the file to read.
   * @return An optional with the bytes of the found cover in a successful case.
   */
  public Optional<byte[]> loadFileAsResource(String trackFilePath) {

    Optional<Path> p;
    Optional<Path> coverFile = findCoverFileName(trackFilePath);
    Optional<byte[]> ret = Optional.empty();

    /* Load the file */
    if (coverFile.isPresent()) {
      ret = Optional.of(loadFile(coverFile.get()));
    }

    return ret;
  }

  @edu.umd.cs.findbugs.annotations.SuppressFBWarnings(
      value = "NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE")
  private Optional<Path> findCoverFileName(String trackFilePath) {

    if (settingsBean.getMusicDirectory().isEmpty()) {
      LOG.info("No music directory set, aborting.");
      return Optional.empty();
    }

    Optional<Path> ret = Optional.empty();
    Path path = Paths.get(settingsBean.getMusicDirectory(), trackFilePath);

    try {
      if (path.getParent() == null || !path.toFile().exists()) {
        throw new Exception();
      }
    } catch (Exception e) {
      LOG.error("No valid path: '{}'", path);
      return Optional.empty();
    }

    if (path.getParent() == null) {
      return Optional.empty();
    }
    List<Path> covers = AmpdUtils.scanDir(path.getParent());

    if (covers.size() > 0) {
      ret = Optional.of(covers.get(0));
    }

    return ret;
  }

  private String buildFileName(CoverType coverType, String artist, String titleOrAlbum) {
    return coverType.getPrefix()
        + AmpdUtils.stripAccents(artist)
        + "_"
        + AmpdUtils.stripAccents(titleOrAlbum)
        + ".jpg";
  }

  private Optional<Path> buildCacheDir() {
    if (!this.useCache()) {
      return Optional.empty();
    }

    Path cacheDirPath = Paths
        .get(System.getProperty("user.home"), ".local", "share", "ampd", CACHE_DIR);

    // create ampd home
    if (!Files.exists(cacheDirPath) && !new File(cacheDirPath.toString()).mkdirs()) {
      LOG.warn(
          "Could not create ampd home-dir: {}. This is not fatal, "
              + "it just means, we can't save or load covers to the local cache.",
          cacheDirPath);
      return Optional.empty();
    }

    return Optional.of(cacheDirPath);
  }

  private boolean useCache() {
    this.chacheDir = buildCacheDir();
    return this.settingsBean.isLocalCoverCache() && this.chacheDir.isPresent();
  }

}
