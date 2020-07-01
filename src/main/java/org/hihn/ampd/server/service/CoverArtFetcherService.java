package org.hihn.ampd.server.service;


import static org.hihn.ampd.server.util.AmpdUtils.loadFile;
import static org.hihn.ampd.server.util.AmpdUtils.scanDir;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.model.CoverType;
import org.hihn.ampd.server.model.SettingsBean;
import org.springframework.stereotype.Service;

/**
 * Looks for album art and covers.
 */
@Service
public class CoverArtFetcherService {

  private final CoverCacheService coverCacheService;

  private final MbCoverService mbCoverService;

  private final SettingsBean settingsBean;

  private final MPD mpd;

  public CoverArtFetcherService(
      CoverCacheService coverCacheService,
      MbCoverService mbCoverService,
      SettingsBean settingsBean, MpdConfiguration mpdConfiguration) {
    this.coverCacheService = coverCacheService;
    this.mbCoverService = mbCoverService;
    this.settingsBean = settingsBean;
    this.mpd = mpdConfiguration.mpd();
  }

  /**
   * Searches multiple sources for the cover of the current played album.
   *
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> getCurrentAlbumCover() {
    MPDSong track = mpd.getPlayer().getCurrentSong();
    if (track == null) {
      return Optional.empty();
    }
    CoverType coverType = (track.getAlbumName().isEmpty()) ? CoverType.SINGLETON : CoverType.ALBUM;
    // Try to load the cover from cache
    Optional<byte[]> cover = coverCacheService
        .loadCover(coverType, track.getArtistName(), track.getTitle());
    // If the cover is not in the cache, try to load it from the MPD music directory
    if (!cover.isPresent()) {
      String trackFilePath = track.getFile();
      cover = coverCacheService.loadFileAsResource(trackFilePath);
    }
    // Now check the musicbrainz cover api
    if (!cover.isPresent()) {
      cover = mbCoverService.getMbCover(track);
    }
    // Save the cover in the cache
    if (cover.isPresent()) {
      coverCacheService.saveCover(coverType, track.getArtistName(), track.getTitle(), cover.get());
    }
    return cover;
  }

  /**
   * See if path leads to an album directory and try to load the cover.
   *
   * @param trackFilePath The file path of a track.
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> findAlbumCover(Optional<String> trackFilePath) {
    if (!trackFilePath.isPresent()) {
      return Optional.empty();
    }
    Path path = Paths.get(settingsBean.getMusicDirectory(), trackFilePath.get());
    List<Path> covers = scanDir(path);
    if (covers.size() > 0) {
      Path coverPath = covers.get(0);
      return Optional.of(loadFile(coverPath));
    }
    return Optional.empty();
  }
}
