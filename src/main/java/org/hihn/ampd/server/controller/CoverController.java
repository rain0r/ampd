package org.hihn.ampd.server.controller;

import java.util.Optional;
import org.hihn.ampd.server.service.CoverArtFetcherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

/**
 * Endpoint for everything cover-releated.
 */
@Controller
public class CoverController {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private static final String CURRENT_COVER_URL = "/current-cover";

  private static final String FIND_COVER_URL = "/find-cover";

  private final CoverArtFetcherService coverArtFetcherService;

  @SuppressWarnings("checkstyle:missingjavadocmethod")
  @Autowired
  public CoverController(CoverArtFetcherService coverArtFetcherService) {
    this.coverArtFetcherService = coverArtFetcherService;
  }

  /**
   * Returns the cover of the currently running track.
   *
   * @return The bytes of the current cover.
   */
  @CrossOrigin
  @RequestMapping(
      value = {CURRENT_COVER_URL},
      produces = MediaType.IMAGE_JPEG_VALUE
  )
  public @ResponseBody
  byte[] getCurrentCover() {
    Optional<byte[]> ret = coverArtFetcherService.getCurrentAlbumCover();
    if (ret.isPresent()) {
      return ret.get();
    }

    throw new ResponseStatusException(
        HttpStatus.NOT_FOUND, "Cover not found"
    );
  }


  /**
   * Tries to find the cover for a track.
   *
   * @param trackFilePath File path of a track.
   * @return The bytes of the input track.
   */
  @CrossOrigin
  @RequestMapping(
      value = {FIND_COVER_URL},
      produces = MediaType.IMAGE_JPEG_VALUE
  )
  public @ResponseBody
  byte[] findCoverByPath(@RequestParam("path") Optional<String> trackFilePath) {
    try {
      return coverArtFetcherService.findAlbumCover(trackFilePath);
    } catch (Exception e) {
      String p = (trackFilePath.isPresent()) ? trackFilePath.get() : "NO_PATH";
      LOG.warn("Could not find a cover for: " + p);
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cover Not Found");
  }
}
