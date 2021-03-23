package org.hihn.ampd.server.service;

import fm.last.musicbrainz.coverart.CoverArt;
import fm.last.musicbrainz.coverart.CoverArtArchiveClient;
import fm.last.musicbrainz.coverart.impl.DefaultCoverArtArchiveClient;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.apache.commons.io.IOUtils;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.musicbrainz.controller.Recording;
import org.musicbrainz.controller.Release;
import org.musicbrainz.model.entity.ReleaseWs2;
import org.musicbrainz.model.searchresult.RecordingResultWs2;
import org.musicbrainz.model.searchresult.ReleaseResultWs2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

/**
 * Queries MusicBrainz for covers.
 */
@Service
public class MbCoverService {

  private static final Logger LOG = LoggerFactory.getLogger(MbCoverService.class);

  private final AmpdSettings ampdSettings;

  private final CoverBlacklistService coverBlacklistService;

  private final CoverCacheService coverCacheService;

  public MbCoverService(final AmpdSettings ampdSettings,
      CoverBlacklistService coverBlacklistService,
      CoverCacheService coverCacheService) {
    this.ampdSettings = ampdSettings;
    this.coverBlacklistService = coverBlacklistService;
    this.coverCacheService = coverCacheService;
  }

  /**
   * Download a cover from Musicbrainz.
   *
   * @param track A {@link MPDSong}.
   * @return The cover.
   */
  public Optional<byte[]> getMbCover(final MPDSong track) {
    if (!ampdSettings.isMbCoverService() || coverBlacklistService.isBlacklisted(track.getFile())) {
      return Optional.empty();
    }
    LOG.debug("Trying to load a cover from the MusicBrainz API");
    Optional<byte[]> cover =
        (isEmpty(track.getAlbumName())) ? searchSingletonMusicBrainzCover(track)
            : searchAlbumMusicBrainzCover(track);
    // Save the cover in the cache
    cover.ifPresent(bytes -> coverCacheService.saveCover(track, bytes));
    return cover;
  }

  private Optional<byte[]> downloadCover(final String uuid) {
    final CoverArtArchiveClient client = new DefaultCoverArtArchiveClient();
    final UUID mbId = UUID.fromString(uuid);
    final CoverArt coverArt = client.getByMbid(mbId);
    Optional<byte[]> ret = Optional.empty();
    if (coverArt != null) {
      final InputStream inputStream;
      try {
        inputStream = coverArt.getFrontImage().getImage();
        ret = Optional.of(IOUtils.toByteArray(inputStream));
      } catch (final Exception e) {
        LOG.error(e.getMessage(), e);
      }
    }
    return ret;
  }


  private Optional<byte[]> searchAlbumMusicBrainzCover(final MPDSong track) {
    final Release releaseController = new Release();
    releaseController.getSearchFilter().setLimit((long) 10);
    releaseController.getSearchFilter().setMinScore((long) 60);
    final String query;
    List<ReleaseResultWs2> releaseResults = new ArrayList<>();
    try {
      query = String
          .format("artist:%s%%20AND%%title:%s", URLEncoder.encode(track.getArtistName(),
              StandardCharsets.UTF_8),
              URLEncoder.encode(track.getAlbumName(), StandardCharsets.UTF_8));
      releaseController.search(query);
      releaseResults = releaseController.getFirstSearchResultPage();
    } catch (final Exception e) {
      LOG.error(e.getMessage(), e);
    }
    if (releaseResults == null) {
      return Optional.empty();
    }

    Optional<byte[]> cover = Optional.empty();
    for (final ReleaseResultWs2 releaseResultWs2 : releaseResults) {
      cover = downloadCover(releaseResultWs2.getRelease().getId());
      if (cover.isPresent()) {
        break;
      }
    }
    return cover;
  }

  private Optional<byte[]> searchSingletonMusicBrainzCover(final MPDSong track) {
    Optional<byte[]> cover = Optional.empty();
    final Recording recordingController = new Recording();
    recordingController.getSearchFilter().setLimit((long) 10);
    recordingController.getSearchFilter().setMinScore((long) 60);
    final String query;
    List<RecordingResultWs2> recordingResults = null;
    try {
      query = String
          .format("artist:%s%%20AND%%20title:%s", URLEncoder.encode(track.getArtistName(),
              StandardCharsets.UTF_8),
              URLEncoder.encode(track.getTitle(), StandardCharsets.UTF_8));
      recordingController.search(query);
      recordingResults = recordingController.getFirstSearchResultPage();
    } catch (final Exception e) {
      LOG.error(e.getMessage(), e);
    }
    if (recordingResults == null) {
      return Optional.empty();
    }
    boolean running = true;
    for (final RecordingResultWs2 recordingResult : recordingResults) {
      for (final ReleaseWs2 release : recordingResult.getRecording().getReleases()) {
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

  private boolean isEmpty(@Nullable Object str) {
    return str == null || "".equals(str);
  }
}
