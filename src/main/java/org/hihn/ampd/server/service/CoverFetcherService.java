package org.hihn.ampd.server.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.CoverType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Searches the local cache and MusicBrainz for covers.
 */
@Service
public class CoverFetcherService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverFetcherService.class);

  private final CoverCacheService coverCacheService;

  private final MbCoverService mbCoverService;

  private final MPD mpd;

  private final AmpdSettings ampdSettings;

  public CoverFetcherService(
      final CoverCacheService coverCacheService,
      final MbCoverService mbCoverService,
      final AmpdSettings ampdSettings,
      final MPD mpd) {
    this.coverCacheService = coverCacheService;
    this.mbCoverService = mbCoverService;
    this.ampdSettings = ampdSettings;
    this.mpd = mpd;
  }

  /**
   * Looks in a specific dirctory for a cover.
   *
   * @param dir The directory that contains a cover.
   * @return The content of the found cover.
   */
  public Optional<byte[]> findAlbumCoverForDir(final String dir) {
    Path path = Paths.get(ampdSettings.getMusicDirectory(), dir);
    List<Path> covers = coverCacheService.scanDir(path);
    if (covers.size() > 0) {
      Path coverPath = covers.get(0);
      return coverCacheService.loadFile(coverPath);
    }
    return Optional.empty();
  }

  /**
   * See if the path of track leads to an album directory and try to load the cover.
   *
   * @param trackFilePath The file path of a track.
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> findAlbumCoverForTrack(final String trackFilePath) {
    try {
      final Collection<MPDSong> foundTracks = mpd.getMusicDatabase().getSongDatabase()
          .searchFileName(trackFilePath);
      if (foundTracks.size() == 1) {
        MPDSong next = foundTracks.iterator().next();
        Collection<MPDAlbum> foo = mpd.getMusicDatabase().getAlbumDatabase()
            .findAlbum(next.getAlbumName());
        return getAlbumCoverForTrack(next);
      }
    } catch (Exception e) {
      LOG.error("Error in searchFileName(): {}", e.getMessage());
    }
    return Optional.empty();
  }

  private Optional<byte[]> getAlbumCoverForTrack(final MPDSong track) {
    if (track == null) {
      return Optional.empty();
    }
    // Try to load the cover from the Mpd music directory
    LOG.debug("Trying to load a cover from the track directory");
    final String trackFilePath = track.getFile();
    Optional<byte[]> cover = coverCacheService.loadFileAsResource(trackFilePath);

    final CoverType coverType =
        (track.getAlbumName().isEmpty()) ? CoverType.SINGLETON : CoverType.ALBUM;
    if (cover.isEmpty()) {
      // Try to load the cover from cache
      cover = coverCacheService.loadCover(coverType, track.getArtistName(), track.getTitle());
    }

    if (cover.isEmpty()) {
      // Load the cover from MusicBrainz
      cover = mbCoverService.getMbCover(track);
      // Save the cover in the cache
      cover.ifPresent(bytes -> coverCacheService
          .saveCover(coverType, track.getArtistName(), track.getTitle(), bytes));
    }
    return cover;
  }
}
