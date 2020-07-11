package org.hihn.ampd.server.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import org.bff.javampd.server.Mpd;
import org.bff.javampd.song.MpdSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.model.CoverType;
import org.hihn.ampd.server.model.SettingsBean;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Looks for album art and covers.
 */
@Service
public class CoverArtFetcherService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private final CoverCacheService coverCacheService;

  private final MbCoverService mbCoverService;
  private final Mpd mpd;
  private final SettingsBean settingsBean;

  public CoverArtFetcherService(
      CoverCacheService coverCacheService,
      MbCoverService mbCoverService,
      SettingsBean settingsBean, MpdConfiguration mpdConfiguration) {
    this.coverCacheService = coverCacheService;
    this.mbCoverService = mbCoverService;
    this.settingsBean = settingsBean;
    mpd = mpdConfiguration.mpd();
  }

  /**
   * See if path leads to an album directory and try to load the cover.
   *
   * @param trackFilePath The file path of a track.
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> findAlbumCover(Optional<String> trackFilePath) {
    if (trackFilePath.isPresent()) {
      Path path = Paths.get(settingsBean.getMusicDirectory(), trackFilePath.get());
      List<Path> covers = coverCacheService.scanDir(path);
      if (covers.size() > 0) {
        Path coverPath = covers.get(0);
        return coverCacheService.loadFile(coverPath);
      }
    }
    return Optional.empty();
  }

  /**
   * Searches multiple sources for the cover of the current played album.
   *
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> getCurrentAlbumCover() {
    MpdSong track = mpd.getPlayer().getCurrentSong();
    if (track == null) {
      LOG.debug("Could not get current song");
      return Optional.empty();
    }
    CoverType coverType = (track.getAlbumName().isEmpty()) ? CoverType.SINGLETON : CoverType.ALBUM;
    LOG.debug("Trying to load a cover of type {} from local cache", coverType);
    // Try to load the cover from cache
    Optional<byte[]> cover = coverCacheService
        .loadCover(coverType, track.getArtistName(), track.getTitle());
    // If the cover is not in the cache, try to load it from the Mpd music directory
    if (!cover.isPresent()) {
      LOG.debug("Trying to load a cover from the track directory");
      String trackFilePath = track.getFile();
      cover = coverCacheService.loadFileAsResource(trackFilePath);
    }
    // Now check the musicbrainz cover api
    if (!cover.isPresent()) {
      LOG.debug("Trying to load a cover from the MusicBrainz API");
      cover = mbCoverService.getMbCover(track);
      // Save the cover in the cache
      if (cover.isPresent()) {
        coverCacheService
            .saveCover(coverType, track.getArtistName(), track.getTitle(), cover.get());
      }
    }
    return cover;
  }
}
