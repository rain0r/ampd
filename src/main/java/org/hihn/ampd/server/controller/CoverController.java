package org.hihn.ampd.server.controller;

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
import java.util.Optional;

@Controller
public class CoverController {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private static final String CURRENT_COVER_URL = "/current-cover";

  private static final String FIND_COVER_URL = "/find-cover";

  private final CoverArtFetcherService coverArtFetcherService;

  @Autowired
  public CoverController(CoverArtFetcherService coverArtFetcherService) {
    this.coverArtFetcherService = coverArtFetcherService;
  }

  @CrossOrigin
  @RequestMapping(value = {CURRENT_COVER_URL}, produces = MediaType.IMAGE_JPEG_VALUE)
  public @ResponseBody byte[] getCurrentCover() {
    Optional<byte[]> ret = Optional.empty();
    try {
      ret = coverArtFetcherService.getCurrentAlbumCover();
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }
    return (ret.isPresent()) ? ret.get() : null;
  }

  @CrossOrigin
  @RequestMapping(value = {FIND_COVER_URL}, produces = MediaType.IMAGE_JPEG_VALUE)
  public @ResponseBody byte[] findCoverByPath(@RequestParam("path") Optional<String> path) {
    try {
      return coverArtFetcherService.findAlbumCover(path);
    } catch (Exception e) {
      String p = (path.isPresent()) ? path.get() : "NO_PATH";
      LOG.warn("Could not find a cover for: " + p);
    }
    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cover Not Found");
  }
}
