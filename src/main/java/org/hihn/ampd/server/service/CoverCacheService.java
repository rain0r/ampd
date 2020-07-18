package org.hihn.ampd.server.service;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import org.hihn.ampd.server.model.CoverType;
import org.hihn.ampd.server.model.SettingsBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Handles the caching of album art.
 */
@Service
public class CoverCacheService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverCacheService.class);
  private final boolean cacheEnabled;
  private final SettingsBean settingsBean;
  private Path chacheDir;

  public CoverCacheService(final SettingsBean settingsBean,
      final AmpdDirService ampdDirService) {
    this.settingsBean = settingsBean;
    cacheEnabled = settingsBean.isLocalCoverCache() && ampdDirService.getCacheDir().isPresent();
    if (cacheEnabled) {
      chacheDir = ampdDirService.getCacheDir().get();
    }
  }

  /**
   * Return who many disk space the cached cover use.
   *
   * @return The size of the cover cache dir in bytes.
   */
  public Long getCoverDiskUsage() {
    long size = 0;
    try {
      if (cacheEnabled) {
        size = Files.walk(chacheDir)
            .filter(p -> p.toFile().isFile())
            .mapToLong(p -> p.toFile().length())
            .sum();
      }
    } catch (final IOException e) {
      LOG.warn("Could not get the size of the cover cache dir: {}", e.getMessage());
    }
    return size;
  }

  /**
   * Loads a cover from the local cache.
   *
   * @param coverType    The type of the cover.
   * @param artist       Artist to which the cover is associated.
   * @param titleOrAlbum Are we looking for the cover of an album or single track.
   * @return An optional with the bytes of the found cover in a successful case.
   */
  public Optional<byte[]> loadCover(final CoverType coverType, final String artist,
      final String titleOrAlbum) {
    if (!cacheEnabled) {
      return Optional.empty();
    }

    final String fileName = buildFileName(coverType, artist, titleOrAlbum);
    final Path fullPath = Paths.get(chacheDir.toString(), fileName)
        .toAbsolutePath();
    try {
      return loadFile(fullPath);
    } catch (final Exception e) {
      return Optional.empty();
    }
  }

  /**
   * Reads a file from disk.
   *
   * @param path The path of a file.
   * @return The bytes of the file.
   */
  public Optional<byte[]> loadFile(final Path path) {
    try {
      return Optional.of(Files.readAllBytes(path));
    } catch (final IOException e) {
      return Optional.empty();
    }
  }

  /**
   * Reads a track from disk.
   *
   * @param trackFilePath The path of the file to read.
   * @return An optional with the bytes of the found cover in a successful case.
   */
  public Optional<byte[]> loadFileAsResource(final String trackFilePath) {
    final Optional<Path> coverFile = findCoverFileName(trackFilePath);
    Optional<byte[]> ret = Optional.empty();
    if (coverFile.isPresent()) {
      ret = loadFile(coverFile.get());
    }
    return ret;
  }

  /**
   * Saves a given cover to the local cache.
   *
   * @param coverType    The type of the cover.
   * @param artist       Artist to which the cover is associated.
   * @param titleOrAlbum Is this the cover of an album or a single track.
   * @param file         The cover itself.
   */
  public void saveCover(final CoverType coverType, final String artist, final String titleOrAlbum,
      final byte[] file) {
    if (!cacheEnabled) {
      return;
    }

    try {
      final String fileName = buildFileName(coverType, artist, titleOrAlbum);
      final Path fullPath = Paths.get(chacheDir.toString(), fileName).toAbsolutePath();

      // Don't write the file if it already exists
      if (!fullPath.toFile().exists()) {
        LOG.debug("Saving cover. coverType: {}, artist: {}, title: {}", coverType, artist,
            titleOrAlbum);
        Files.write(fullPath, file);
      }
    } catch (final IOException e) {
      LOG.warn("Failed to save cover to local cache: {}", e.getMessage());
    }
  }

  /**
   * Scans given dir for covers.
   *
   * @param path The dir to search for covers.
   * @return A list of found covers.
   */
  @edu.umd.cs.findbugs.annotations.SuppressFBWarnings(
      value = "RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE",
      justification = "It's a java 11 compiler bug")
  public List<Path> scanDir(final Path path) {
    final List<Path> covers = new ArrayList<>();
    try (final DirectoryStream<Path> stream = Files
        .newDirectoryStream(path, "cover.{jpg,jpeg,png}")) {
      stream.forEach(covers::add);
    } catch (final IOException e) {
      LOG.debug("No covers found in: {}", path);
    }
    return covers;
  }

  private String buildFileName(final CoverType coverType, final String artist,
      final String titleOrAlbum) {
    return coverType.getPrefix()
        + stripAccents(artist)
        + "_"
        + stripAccents(titleOrAlbum)
        + ".jpg";
  }

  @edu.umd.cs.findbugs.annotations.SuppressFBWarnings(
      value = "NP_NULL_ON_SOME_PATH_FROM_RETURN_VALUE")
  private Optional<Path> findCoverFileName(final String trackFilePath) {

    if (settingsBean.getMusicDirectory().isEmpty()) {
      LOG.info("No music directory set, aborting.");
      return Optional.empty();
    }

    Optional<Path> ret = Optional.empty();
    final Path path = Paths.get(settingsBean.getMusicDirectory(), trackFilePath);

    if (path.getParent() == null || !path.toFile().exists()) {
      LOG.error("No valid path: '{}'", path);
      return Optional.empty();
    }

    if (path.getParent() == null) {
      return Optional.empty();
    }
    final List<Path> covers = scanDir(path.getParent());

    if (covers.size() > 0) {
      ret = Optional.of(covers.get(0));
    }

    return ret;
  }

  /**
   * Strips all unpleasant characters from a string.
   *
   * @param input Input string to strip.
   * @return The stripped string.
   */
  private String stripAccents(String input) {
    if (input == null) {
      return null;
    }
    Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+"); // $NON-NLS-1$
    StringBuilder decomposed =
        new StringBuilder(Normalizer.normalize(input, Normalizer.Form.NFD));
    return pattern.matcher(decomposed).replaceAll("");
  }
}
