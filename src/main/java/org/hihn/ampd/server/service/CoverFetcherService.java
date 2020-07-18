package org.hihn.ampd.server.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
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
 * Searches the local cache and MusicBrainz for covers.
 */
@Service
public class CoverFetcherService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverFetcherService.class);
  private final CoverBlacklistService coverBlacklistService;
  private final CoverCacheService coverCacheService;
  private final MbCoverService mbCoverService;
  private final Mpd mpd;
  private final SettingsBean settingsBean;

  public CoverFetcherService(
      final CoverCacheService coverCacheService,
      final MbCoverService mbCoverService,
      final MpdConfiguration mpdConfiguration, SettingsBean settingsBean,
      CoverBlacklistService coverBlacklistService) {
    this.coverCacheService = coverCacheService;
    this.mbCoverService = mbCoverService;
    this.settingsBean = settingsBean;
    mpd = mpdConfiguration.mpd();
    this.coverBlacklistService = coverBlacklistService;
  }

  /**
   * Looks in a specific dirctory for a cover.
   *
   * @param dir The directory that contains a cover.
   * @return The content of the found cover.
   */
  public Optional<byte[]> findAlbumCoverForDir(final Optional<String> dir) {
    if (dir.isPresent()) {
      Path path = Paths.get(settingsBean.getMusicDirectory(), dir.get());
      List<Path> covers = coverCacheService.scanDir(path);
      if (covers.size() > 0) {
        Path coverPath = covers.get(0);
        return coverCacheService.loadFile(coverPath);
      }
    }
    return Optional.empty();
  }

  /**
   * See if the path of track leads to an album directory and try to load the cover.
   *
   * @param trackFilePath The file path of a track.
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> findAlbumCoverForTrack(final Optional<String> trackFilePath) {
    if (trackFilePath.isEmpty()) {
      return Optional.empty();
    }
    final Collection<MpdSong> foundSongs = mpd.getMusicDatabase().getSongDatabase()
        .searchFileName(trackFilePath.get());
    if (foundSongs.size() == 1) {
      return getAlbumCoverForTrack(foundSongs.iterator().next());
    }
    return Optional.empty();
  }

  /**
   * Searches multiple sources for the cover of the currently played track.
   *
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> getCoverForCurrentTrack() {
    return getAlbumCoverForTrack(mpd.getPlayer().getCurrentSong());
  }

  private Optional<byte[]> getAlbumCoverForTrack(final MpdSong track) {
    if (track == null || coverBlacklistService.isBlacklisted(track.getFile())) {
      return Optional.empty();
    }
    final CoverType coverType =
        (track.getAlbumName().isEmpty()) ? CoverType.SINGLETON : CoverType.ALBUM;
    LOG.debug("Trying to load a cover of type {} from local cache", coverType);
    // Try to load the cover from cache
    Optional<byte[]> cover = coverCacheService
        .loadCover(coverType, track.getArtistName(), track.getTitle());
    // If the cover is not in the cache, try to load it from the Mpd music directory
    if (cover.isEmpty()) {
      LOG.debug("Trying to load a cover from the track directory");
      final String trackFilePath = track.getFile();
      cover = coverCacheService.loadFileAsResource(trackFilePath);
    }
    // Now check the musicbrainz cover api
    if (cover.isEmpty()) {
      LOG.debug("Trying to load a cover from the MusicBrainz API");
      cover = mbCoverService.getMbCover(track);
      // Save the cover in the cache
      cover.ifPresent(bytes -> coverCacheService
          .saveCover(coverType, track.getArtistName(), track.getTitle(), bytes));
    }
    return cover;
  }
}
