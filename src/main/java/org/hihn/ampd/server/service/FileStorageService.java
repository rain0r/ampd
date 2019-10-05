package org.hihn.ampd.server.service;

import static org.hihn.ampd.server.util.AmpdUtils.loadFile;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class FileStorageService {

  private static final Logger LOG = LoggerFactory.getLogger(FileStorageService.class);

  @Value("${mpd.music.directory:}")
  // ':' sets an empty str if the prop is not set
  private String musicDirectory;

  public Optional<byte[]> loadFileAsResource(String songFilePath) {

    Optional<Path> p;
    Optional<Path> coverFile = findCoverFileName(songFilePath);
    Optional<byte[]> ret = Optional.empty();

    /* Load the file */
    if (coverFile.isPresent()) {
      ret = Optional.of(loadFile(coverFile.get()));
    }

    return ret;
  }

  private Optional<Path> findCoverFileName(String songFilePath) {
    List<Path> covers = new ArrayList<>();
    Optional<Path> ret = Optional.empty();
    Path path;

    try {
      path = Paths.get(musicDirectory, songFilePath);

      if (!path.toFile().exists()) {
        throw new Exception();
      }
    } catch (Exception e) {
      LOG.error("No valid path: " + songFilePath);
      return Optional.empty();
    }

    try (DirectoryStream<Path> stream =
        Files.newDirectoryStream(path.getParent(), "cover.{jpg,jpeg,png}")) {

      stream.forEach(file -> covers.add(file));

    } catch (IOException e) {
      LOG.info("Could not load art in {}", path, e);
    }

    if (covers.size() > 0) {
      ret = Optional.of(covers.get(0));
    }

    return ret;
  }
}
