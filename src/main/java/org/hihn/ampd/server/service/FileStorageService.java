package org.hihn.ampd.server.service;

import static org.hihn.ampd.server.util.AmpdUtils.loadFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import org.hihn.ampd.server.util.AmpdUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Saves and loads cover files locally.
 */
@Service
public class FileStorageService {

  private static final Logger LOG = LoggerFactory.getLogger(FileStorageService.class);

  @Value("${mpd.music.directory:}")
  // ':' sets an empty str if the prop is not set
  private String musicDirectory;

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

    Optional<Path> ret = Optional.empty();
    Path path;

    try {
      path = Paths.get(musicDirectory, trackFilePath);

      if (path.getParent() == null || !path.toFile().exists()) {
        throw new Exception();
      }
    } catch (Exception e) {
      LOG.error("No valid path: " + trackFilePath);
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
}
