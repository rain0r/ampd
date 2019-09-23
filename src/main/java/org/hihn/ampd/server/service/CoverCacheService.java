package org.hihn.ampd.server.service;

import org.hihn.ampd.server.util.AmpdUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import static org.hihn.ampd.server.util.AmpdUtils.loadFile;

@Service
public class CoverCacheService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverCacheService.class);

  @Value("${ampd.home:}")
  private String ampdHome;

  private final static String CACHE_DIR = "covers";

  public enum COVER_TYPE {
    ALBUM("a_"), SINGLETON("s_");

    private String prefix;

    COVER_TYPE(String prefix) {
      this.prefix = prefix;
    }

    public String getPrefix() {
      return prefix;
    }
  }

  public CoverCacheService() {
    ampdHome = buildAmpdHome();

    // create ampd home
    if (!Files.exists(Paths.get(ampdHome)) && !new File(ampdHome).mkdirs()) {
      LOG.error("Could not create dir: " + ampdHome);
    }

    // create cover cache dir
    Path fullCacheDir = Paths.get(ampdHome, CACHE_DIR);
    if (!Files.exists(Paths.get(ampdHome)) && !new File(fullCacheDir.toString()).mkdirs()) {
      LOG.error("Could not create dir: " + ampdHome);
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

  public Optional<byte[]> loadCover(COVER_TYPE coverType, String artist, String titleOrAlbum) {
    String fileName = buildFileName(coverType, artist, titleOrAlbum);
    Path fullPath = Paths.get(buildAmpdHome(), CACHE_DIR, fileName).toAbsolutePath();
    return loadFile(fullPath);
  }

  public void saveCover(COVER_TYPE coverType, String artist, String titleOrAlbum, byte[] file) {
    try {
      String fileName = buildFileName(coverType, artist, titleOrAlbum);
      Path fullPath = Paths.get(buildAmpdHome(), CACHE_DIR, fileName).toAbsolutePath();

      // Don't write the file if it already exists
      if (!fullPath.toFile().exists()) {
        LOG.debug("Saving cover: " + coverType + " :: " + artist + " - " + titleOrAlbum);
        Files.write(fullPath, file);
      }
    } catch (IOException e) {
      LOG.error(e.getMessage(), e);
    }
  }

  private String buildFileName(COVER_TYPE coverType, String artist, String titleOrAlbum) {
    return coverType.getPrefix() + AmpdUtils.stripAccents(artist) + "_"
        + AmpdUtils.stripAccents(titleOrAlbum) + ".jpg";
  }

}
