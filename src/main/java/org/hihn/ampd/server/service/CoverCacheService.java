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
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.CoverType;
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

  private final AmpdSettings ampdSettings;

  private Path chacheDir;

  public CoverCacheService(final AmpdSettings ampdSettings,
      final AmpdDirService ampdDirService) {
    this.ampdSettings = ampdSettings;
    cacheEnabled = ampdSettings.isLocalCoverCache() && ampdDirService.getCacheDir().isPresent();
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
   * Loads a cover from the local cache.
   *
   * @param track The track to load the cover for.
   * @return An optional with the bytes of the found cover in a successful case.
   */
  public Optional<byte[]> loadCover(MPDSong track) {
    if (!cacheEnabled) {
      LOG.debug("Cache is disabled, not looking for a locally saved cover.");
      return Optional.empty();
    }

    final Path fullPath = buildCacheFullPath(track);
    if (!fullPath.toFile().exists()) {
      LOG.debug("File does not exists, aborting: {}", fullPath.toString());
      return Optional.empty();
    }
    try {
      LOG.debug("Loading cover: {}", fullPath.toString());
      return loadFile(fullPath);
    } catch (final Exception e) {
      return Optional.empty();
    }
  }

  /**
   * Saves a given cover to the local cache.
   *
   * @param track The track to save the cover for.
   * @param file  The cover itself.
   */
  public void saveCover(final MPDSong track, final byte[] file) {
    if (!cacheEnabled) {
      return;
    }

    final Path fullPath = buildCacheFullPath(track);
    try {
      // Don't write the file if it already exists
      if (!fullPath.toFile().exists()) {
        LOG.debug("Saving cover: {}", fullPath);
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
    if (ampdSettings.getMusicDirectory().isEmpty()) {
      LOG.info("No music directory set, not looking for local file.");
      return Optional.empty();
    }

    Optional<Path> ret = Optional.empty();
    final Path path = Paths.get(ampdSettings.getMusicDirectory(), trackFilePath);

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

  private Path buildCacheFullPath(MPDSong track) {
    final CoverType coverType =
        (track.getAlbumName().isEmpty()) ? CoverType.SINGLETON : CoverType.ALBUM;
    final String titleOrAlbum =
        (coverType == CoverType.ALBUM) ? track.getAlbumName() : track.getTitle();
    final String fileName = buildFileName(coverType, track.getArtistName(), titleOrAlbum);
    return Paths.get(chacheDir.toString(), fileName).toAbsolutePath();
  }
}
