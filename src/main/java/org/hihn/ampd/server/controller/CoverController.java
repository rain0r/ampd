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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class CoverController {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private static final String CURRENT_COVER_URL = "/current-cover";

  private final CoverArtFetcherService coverArtFetcherService;

  @Autowired
  public CoverController(CoverArtFetcherService coverArtFetcherService) {
    this.coverArtFetcherService = coverArtFetcherService;
  }

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
}
