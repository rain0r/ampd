package org.hihn.ampd.server.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.Normalizer;
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

  private Path cacheDir;

  /**
   * Handles the caching of album art.
   *
   * @param ampdSettings   Settings of this ampd instance.
   * @param ampdDirService Handles access to the ampd dir in the home directory.
   */
  public CoverCacheService(final AmpdSettings ampdSettings,
      final AmpdDirService ampdDirService) {
    cacheEnabled = ampdSettings.isLocalCoverCache() && ampdDirService.getCacheDir().isPresent();
    if (cacheEnabled) {
      cacheDir = ampdDirService.getCacheDir().get();
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
        size = Files.walk(cacheDir)
            .filter(p -> p.toFile().isFile())
            .mapToLong(p -> p.toFile().length())
            .sum();
      }
    } catch (final IOException e) {
      LOG.warn("Could not get the size of the cover cache dir", e);
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
    if (fullPath == null || !fullPath.toFile().exists()) {
      LOG.debug("File does not exist in cache, aborting: {}", track);
      return Optional.empty();
    }
    try {
      LOG.debug("Loading cached cover: {}", fullPath.toString());
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
      if (fullPath != null && !fullPath.toFile().exists()) {
        LOG.debug("Saving cover: {}", fullPath);
        Files.write(fullPath, file);
      }
    } catch (final IOException e) {
      LOG.warn("Failed to save cover to local cache", e);
    }
  }

  private String buildFileName(final CoverType coverType, final String artist,
      final String titleOrAlbum) {
    return coverType.getPrefix()
        + stripAccents(artist)
        + "_"
        + stripAccents(titleOrAlbum)
        + ".jpg";
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
    try {
      return Paths.get(cacheDir.toString(), fileName).toAbsolutePath();
    } catch (InvalidPathException e) {
      LOG.error("Error getting Path for: {}", fileName, e);
      return null;
    }
  }
}
