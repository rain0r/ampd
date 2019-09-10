package org.hihn.ampd.server.controller;

import static org.hihn.ampd.server.service.CoverCacheService.COVER_TYPE.ALBUM;
import java.util.Optional;
import org.hihn.ampd.server.service.CoverArtFetcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CoverController {

  private static final String ALBUM_URL_PREFIX = "album-cover/";

  private static final String SINGLETON_URL_PREFIX = "singleton-cover/";

  private final CoverArtFetcherService coverArtFetcherService;

  @Autowired
  public CoverController(CoverArtFetcherService coverArtFetcherService) {
    this.coverArtFetcherService = coverArtFetcherService;
  }

  @CrossOrigin
  @GetMapping(value = ALBUM_URL_PREFIX + "{filePath}", produces = MediaType.IMAGE_JPEG_VALUE)
  public @ResponseBody byte[] getCoverByFilePath(@PathVariable("filePath") String filePath,
      @RequestParam("artist") Optional<String> artistName,
      @RequestParam("album") Optional<String> albumName) {

    Optional<byte[]> ret =
        coverArtFetcherService.getAlbumCover(ALBUM, filePath, artistName, albumName);

    if (ret.isPresent()) {
      return ret.get();
    }

    return null;
  }

  @CrossOrigin
  @GetMapping(value = SINGLETON_URL_PREFIX, produces = MediaType.IMAGE_JPEG_VALUE)
  public @ResponseBody byte[] getSingletonCover(@RequestParam("artist") Optional<String> artist,
      @RequestParam("title") Optional<String> title) {

    if (artist.isPresent() && title.isPresent()) {
      Optional<byte[]> ret =
          coverArtFetcherService.getSingletonCoverFromWeb(artist.get(), title.get());
      if (ret.isPresent()) {
        return ret.get();
      }
    }

    return null;
  }
}
