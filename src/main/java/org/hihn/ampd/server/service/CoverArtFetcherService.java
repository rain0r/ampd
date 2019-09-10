package org.hihn.ampd.server.service;

import static org.hihn.ampd.server.service.CoverCacheService.COVER_TYPE.ALBUM;
import static org.hihn.ampd.server.service.CoverCacheService.COVER_TYPE.SINGLETON;
import static org.hihn.ampd.server.util.AmpdUtils.loadFile;
import fm.last.musicbrainz.coverart.CoverArt;
import fm.last.musicbrainz.coverart.CoverArtArchiveClient;
import fm.last.musicbrainz.coverart.impl.DefaultCoverArtArchiveClient;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.apache.commons.io.IOUtils;
import org.musicbrainz.controller.Recording;
import org.musicbrainz.controller.Release;
import org.musicbrainz.model.entity.ReleaseWs2;
import org.musicbrainz.model.searchresult.RecordingResultWs2;
import org.musicbrainz.model.searchresult.ReleaseResultWs2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CoverArtFetcherService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private final FileStorageService fileStorageService;

  private final CoverCacheService coverCacheService;

  public CoverArtFetcherService(FileStorageService fileStorageService,
      CoverCacheService coverCacheService) {
    this.fileStorageService = fileStorageService;
    this.coverCacheService = coverCacheService;
  }

  public Optional<byte[]> getAlbumCover(CoverCacheService.COVER_TYPE album, String filePath,
      Optional<String> artistName, Optional<String> albumName) {
    Optional<byte[]> cover = fileStorageService.loadFileAsResource(filePath);

    if (!cover.isPresent()) {
      if (artistName.isPresent() && albumName.isPresent()) {
        /* Huh, maybe this is a singleton with an 'album' id3 tag */
        cover = getAlbumCoverFromWeb(artistName.get(), albumName.get());
      }
    }

    if (!cover.isPresent()) {
      cover = loadFallbackCover();
    }

    return cover;
  }

  public Optional<byte[]> getSingletonCoverFromWeb(String artist, String title) {
    Optional<byte[]> cover;

    cover = coverCacheService.loadCover(SINGLETON, artist, title);
    if (cover.isPresent()) {
      LOG.info("Found cached cover for: " + artist + " - " + title);
      return cover;
    }

    cover = searchSingletonMusicBrainzCover(artist, title);
    if (!cover.isPresent()) {
      LOG.info("No cover available for: " + artist + " - " + title);
      return Optional.empty();
    }

    coverCacheService.saveCover(SINGLETON, artist, title, cover.get());
    LOG.info("Found cover for: " + artist + " - " + title);
    return cover;
  }

  private Optional<byte[]> getAlbumCoverFromWeb(String artistName, String albumName) {
    Optional<byte[]> cover;

    cover = coverCacheService.loadCover(ALBUM, artistName, albumName);
    if (cover.isPresent()) {
      LOG.info("Found cached cover for: " + artistName + " - " + albumName);
      return cover;
    }

    cover = searchAlbumMusicBrainzCover(artistName, albumName);
    if (!cover.isPresent()) {
      LOG.info("No cover available for: " + artistName + " - " + albumName);
      return Optional.empty();
    }

    coverCacheService.saveCover(ALBUM, artistName, albumName, cover.get());
    LOG.info("Found cover for: " + artistName + " - " + albumName);
    return cover;

  }

  private Optional<byte[]> searchAlbumMusicBrainzCover(String artistName, String albumName) {
    Optional<byte[]> cover = Optional.empty();
    Release releaseController = new Release();
    releaseController.getSearchFilter().setLimit((long) 10);
    releaseController.getSearchFilter().setMinScore((long) 60);
    String query;
    List<ReleaseResultWs2> releaseResults = null;
    try {
      query = String.format("artist:%s%%20AND%%title:%s", URLEncoder.encode(artistName, "UTF-8"),
          URLEncoder.encode(albumName, "UTF-8"));
      releaseController.search(query);
      releaseResults = releaseController.getFirstSearchResultPage();
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }

    if (releaseResults == null) {
      LOG.info("No search results available for: " + artistName + " - " + albumName);
      return Optional.empty();
    }

    for (ReleaseResultWs2 releaseResultWs2 : releaseResults) {
      cover = downloadCover(releaseResultWs2.getRelease().getId());
      if (cover.isPresent()) {
        break;
      }
    }

    return cover;
  }

  private Optional<byte[]> searchSingletonMusicBrainzCover(String artist, String title) {
    Optional<byte[]> cover = Optional.empty();
    Recording recordingController = new Recording();
    recordingController.getSearchFilter().setLimit((long) 10);
    recordingController.getSearchFilter().setMinScore((long) 60);
    String query;
    List<RecordingResultWs2> recordingResults = null;
    try {
      query = String.format("artist:%s%%20AND%%20title:%s", URLEncoder.encode(artist, "UTF-8"),
          URLEncoder.encode(title, "UTF-8"));
      recordingController.search(query);
      recordingResults = recordingController.getFirstSearchResultPage();
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }

    if (recordingResults == null) {
      LOG.info("No search results available for: " + artist + " - " + title);
      return Optional.empty();
    }

    boolean running = true;
    for (RecordingResultWs2 recordingResult : recordingResults) {
      for (ReleaseWs2 release : recordingResult.getRecording().getReleases()) {
        cover = downloadCover(release.getId());
        if (cover.isPresent()) {
          running = false;
          break;
        }
      }

      if (!running) {
        break;
      }
    }

    return cover;
  }

  private Optional<byte[]> downloadCover(String uuid) {
    Optional<byte[]> ret = Optional.empty();
    CoverArtArchiveClient client = new DefaultCoverArtArchiveClient();
    UUID mbId = UUID.fromString(uuid);
    CoverArt coverArt = client.getByMbid(mbId);
    if (coverArt != null) {
      InputStream inputStream;
      try {
        inputStream = coverArt.getFrontImage().getImage();
        ret = Optional.of(IOUtils.toByteArray(inputStream));
      } catch (IOException e) {
        LOG.error(e.getMessage(), e);
      }
    }

    return ret;
  }

  private Optional<byte[]> loadFallbackCover() {
    Path transparentFile = Paths.get(getClass().getResource("/transparent.png").getFile());
    return loadFile(transparentFile);
  }
}
