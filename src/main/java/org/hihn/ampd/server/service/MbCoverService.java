package org.hihn.ampd.server.service;

import fm.last.musicbrainz.coverart.CoverArt;
import fm.last.musicbrainz.coverart.CoverArtArchiveClient;
import fm.last.musicbrainz.coverart.impl.DefaultCoverArtArchiveClient;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.apache.commons.io.IOUtils;
import org.bff.javampd.song.MpdSong;
import org.hihn.ampd.server.model.SettingsBean;
import org.musicbrainz.controller.Recording;
import org.musicbrainz.controller.Release;
import org.musicbrainz.model.entity.ReleaseWs2;
import org.musicbrainz.model.searchresult.RecordingResultWs2;
import org.musicbrainz.model.searchresult.ReleaseResultWs2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class MbCoverService {

  private static final Logger LOG = LoggerFactory.getLogger(MbCoverService.class);

  private final SettingsBean settingsBean;

  public MbCoverService(SettingsBean settingsBean) {
    this.settingsBean = settingsBean;
  }

  /**
   * Download a cover from Musicbrainz.
   *
   * @param track A {@link MpdSong}.
   * @return The cover.
   */
  public Optional<byte[]> getMbCover(MpdSong track) {
    Optional<byte[]> ret = Optional.empty();
    if (settingsBean.isMbCoverService()) {
      if (StringUtils.isEmpty(track.getAlbumName())) {
        ret = searchSingletonMusicBrainzCover(track);
      } else {
        ret = searchAlbumMusicBrainzCover(track);
      }
    }
    return ret;
  }

  private Optional<byte[]> searchAlbumMusicBrainzCover(MpdSong track) {
    Optional<byte[]> cover = Optional.empty();
    Release releaseController = new Release();
    releaseController.getSearchFilter().setLimit((long) 10);
    releaseController.getSearchFilter().setMinScore((long) 60);
    String query;
    List<ReleaseResultWs2> releaseResults = null;
    try {
      query = String
          .format("artist:%s%%20AND%%title:%s", URLEncoder.encode(track.getArtistName(), "UTF-8"),
              URLEncoder.encode(track.getAlbumName(), "UTF-8"));
      releaseController.search(query);
      releaseResults = releaseController.getFirstSearchResultPage();
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }
    if (releaseResults == null) {
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

  private Optional<byte[]> searchSingletonMusicBrainzCover(MpdSong track) {
    Optional<byte[]> cover = Optional.empty();
    Recording recordingController = new Recording();
    recordingController.getSearchFilter().setLimit((long) 10);
    recordingController.getSearchFilter().setMinScore((long) 60);
    String query;
    List<RecordingResultWs2> recordingResults = null;
    try {
      query = String
          .format("artist:%s%%20AND%%20title:%s", URLEncoder.encode(track.getArtistName(), "UTF-8"),
              URLEncoder.encode(track.getTitle(), "UTF-8"));
      recordingController.search(query);
      recordingResults = recordingController.getFirstSearchResultPage();
    } catch (Exception e) {
      LOG.error(e.getMessage(), e);
    }
    if (recordingResults == null) {
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
      } catch (Exception e) {
        LOG.error(e.getMessage(), e);
      }
    }
    return ret;
  }
}
