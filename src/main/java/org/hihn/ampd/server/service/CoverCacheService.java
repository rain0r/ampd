package org.hihn.ampd.server.service;

import static org.hihn.ampd.server.util.AmpdUtils.loadFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import org.hihn.ampd.server.util.AmpdUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Handles the caching of album art.
 */
@Service
public class CoverCacheService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverCacheService.class);

  @Value("${ampd.home:}")
  private String ampdHome;

  private static final String CACHE_DIR = "covers";

  public enum CoverType {
    ALBUM("a_"),
    SINGLETON("s_");

    private String prefix;

    CoverType(String prefix) {
      this.prefix = prefix;
    }

    public String getPrefix() {
      return prefix;
    }
  }

  @SuppressWarnings("checkstyle:missingjavadocmethod")
  public CoverCacheService() {
    ampdHome = buildAmpdHome();

    // create ampd home
    if (!Files.exists(Paths.get(ampdHome)) && !new File(ampdHome).mkdirs()) {
      LOG.warn(
          "Could not create ampd home-dir: {}. This is not fatal, "
              + "it just means, we can't save or load covers to the local cache.",
          ampdHome);
      return;
    }

    // create cover cache dir
    Path fullCacheDir = Paths.get(ampdHome, CACHE_DIR);
    if (!Files.exists(Paths.get(ampdHome)) && !new File(fullCacheDir.toString()).mkdirs()) {
      LOG.warn(
          "Could not create ampd home-dir: {}. This is not fatal, "
              + "it just means, we can't save or load covers to the local cache.",
          ampdHome);
      return;
    }
  }

  private String buildAmpdHome() {
    String ret = ampdHome;
    if (StringUtils.isEmpty(ret)) {
      Path p = Paths.get(System.getProperty("user.home"), ".local", "share", "ampd");
      ret = p.toString();
    }
    return ret;
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
    String fileName = buildFileName(coverType, artist, titleOrAlbum);
    Path fullPath = Paths.get(buildAmpdHome(), CACHE_DIR, fileName).toAbsolutePath();
    try {
      return Optional.of(loadFile(fullPath));
    } catch (Exception e) {
      // Do nothing
    }
    return Optional.empty();
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
    try {
      String fileName = buildFileName(coverType, artist, titleOrAlbum);
      Path fullPath = Paths.get(buildAmpdHome(), CACHE_DIR, fileName).toAbsolutePath();

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

  private String buildFileName(CoverType coverType, String artist, String titleOrAlbum) {
    return coverType.getPrefix()
        + AmpdUtils.stripAccents(artist)
        + "_"
        + AmpdUtils.stripAccents(titleOrAlbum)
        + ".jpg";
  }
}
