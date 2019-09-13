package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.service.CoverArtFetcherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.Optional;

@Controller
public class CoverController {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private static final String COVER_URL = "/cover";

  private final CoverArtFetcherService coverArtFetcherService;

  @Autowired
  public CoverController(CoverArtFetcherService coverArtFetcherService) {
    this.coverArtFetcherService = coverArtFetcherService;
  }

  @CrossOrigin
  @RequestMapping(value = {COVER_URL}, produces = MediaType.IMAGE_JPEG_VALUE)
  public @ResponseBody byte[] getCoverByFilePath() {
    Optional<byte[]> ret = Optional.empty();
    try {
      ret = coverArtFetcherService.getAlbumCover();
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }
    if (ret.isPresent()) {
      return ret.get();
    }
    return null;
  }
}
