package org.hihn.ampd.server.controller;

import java.util.Optional;
import org.hihn.ampd.server.service.CoverFetcherService;
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
@CrossOrigin
public class CoverController {

  private final CoverFetcherService coverFetcherService;

  @Autowired
  public CoverController(final CoverFetcherService coverFetcherService) {
    this.coverFetcherService = coverFetcherService;
  }

  /**
   * Tries to find the cover for a directory.
   *
   * @param dirPath Path of a directory.
   * @return The bytes of the found cover.
   */
  @RequestMapping(
      value = {"/find-dir-cover"},
      produces = MediaType.IMAGE_JPEG_VALUE
  )
  public @ResponseBody
  byte[] findAlbumCoverForDir(@RequestParam("path") final Optional<String> dirPath) {
    return coverFetcherService.findAlbumCoverForDir(dirPath)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  /**
   * Tries to find the cover for a track.
   *
   * @param trackFilePath File path of a track.
   * @return The bytes of the found cover.
   */
  @RequestMapping(
      value = {"/find-track-cover"},
      produces = MediaType.IMAGE_JPEG_VALUE
  )
  public @ResponseBody
  byte[] findAlbumCoverForTrack(@RequestParam("path") final Optional<String> trackFilePath) {
    return coverFetcherService.findAlbumCoverForTrack(trackFilePath)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }

  /**
   * Returns the cover of the currently running track.
   *
   * @return The bytes of the cover of the currently played track.
   */
  @RequestMapping(
      value = {"/current-cover"},
      produces = MediaType.IMAGE_JPEG_VALUE
  )
  public @ResponseBody
  byte[] getCoverForCurrentTrack() {
    return coverFetcherService.getCoverForCurrentTrack()
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
  }
}
