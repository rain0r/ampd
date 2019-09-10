package org.hihn.ampd.server.service;

import static org.hihn.ampd.server.util.AmpdUtils.loadFile;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class FileStorageService {

  private static final Logger LOG = LoggerFactory.getLogger(FileStorageService.class);

  @Value("${mpd.music.directory}")
  private String musicDirectory;

  public Optional<byte[]> loadFileAsResource(String albumDir) {

    Optional<Path> p = Optional.empty();
    Optional<Path> coverFile = Optional.empty();
    Optional<byte[]> ret = Optional.empty();

    /* Base64 to path */
    p = base64ToStr(albumDir);

    /* Find the cover file */
    if (p.isPresent()) {
      coverFile = findCoverFileName(p.get());
    }

    /* Load the file */
    if (coverFile.isPresent()) {
      ret = loadFile(coverFile.get());
    }

    return ret;
  }

  private Optional<Path> findCoverFileName(Path path) {
    List<Path> covers = new ArrayList<>();
    Optional<Path> ret = Optional.empty();

    Assert.notNull(path, "path was null");

    try (DirectoryStream<Path> stream =
        Files.newDirectoryStream(path.getParent(), "cover.{jpg,jpeg,png}")) {
      stream.forEach(file -> covers.add(file));
    } catch (IOException e) {
      LOG.error("Could not load art in {}", path, e);
    }
    if (covers.size() > 0) {
      ret = Optional.of(covers.get(0));
    }
    return ret;
  }

  private Optional<Path> base64ToStr(String filePath) {
    Optional<Path> ret = Optional.empty();
    try {
      String decoded =
          new String(Base64.getDecoder().decode(filePath.getBytes(StandardCharsets.UTF_8)),
              StandardCharsets.UTF_8);
      String fullFilePath = musicDirectory + File.separator + decoded;
      ret = Optional.of(Paths.get(fullFilePath));
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }
    return ret;
  }

}
