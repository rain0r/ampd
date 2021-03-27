package org.hihn.ampd.server.service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.art.MPDArtwork;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.model.AmpdSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Methods to load album artworks from the music directory.
 */
@Service
public class CoverService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverService.class);

  private final MPD mpd;

  private final AmpdSettings ampdSettings;

  private final CoverCacheService coverCacheService;

  private final MbCoverService mbCoverService;

  public CoverService(
      final AmpdSettings ampdSettings,
      final MPD mpd, CoverCacheService coverCacheService,
      MbCoverService mbCoverService) {
    this.ampdSettings = ampdSettings;
    this.mpd = mpd;
    this.coverCacheService = coverCacheService;
    this.mbCoverService = mbCoverService;
  }

  /**
   * Finds a cover for a track file path.
   *
   * @param trackFilePath A track file path.
   * @return An Optional containing the cover as bytes.
   */
  public Optional<byte[]> findAlbumCoverForTrack(final String trackFilePath) {
    MPDSong track;
    try {
      // Map the track file path to a MPDSong
      track = mpd.getMusicDatabase().getSongDatabase()
          .searchFileName(trackFilePath).iterator().next();
    } catch (Exception e) {
      LOG.error("Could not find MPDTrack for file: {}", trackFilePath);
      return Optional.empty();
    }

    // Try to load the cover from the Mpd music directory
    Optional<byte[]> cover = loadArtworkForTrack(track);

    if (cover.isEmpty()) {
      // Try to load the cover from cache
      cover = coverCacheService.loadCover(track);
    }

    if (cover.isEmpty()) {
      // Load the cover from MusicBrainz
      cover = mbCoverService.getMbCover(track);
    }
    return cover;
  }

  /**
   * Looks in a specific dirctory for a cover.
   *
   * @param dirPath The directory that contains a cover.
   * @return The content of the found cover.
   */
  public Optional<byte[]> loadArtworkFordir(final String dirPath) {
    try {
      // Build the full path to search for the artwork, that is the MPD music_directory + dirPath
      final Path path = Paths.get(ampdSettings.getMusicDirectory(), dirPath);
      MPDArtwork artwork = mpd.getArtworkFinder().find(path.toString()).iterator().next();
      return Optional.of(artwork.getBytes());
    } catch (Exception e) {
      LOG.error("Could not load filename for Track: {}", dirPath);
      LOG.error(e.getMessage(), e);
    }
    return Optional.empty();
  }

  /**
   * See if the path of track leads to an album directory and try to load the cover.
   *
   * @param track The track to find the artwork for.
   * @return The bytes of the found cover.
   */
  public Optional<byte[]> loadArtworkForTrack(final MPDSong track) {

    // Only look for local covers if a music directory is set
    if (ampdSettings.getMusicDirectory().equals("")) {
      LOG.debug("musicDirectory is empty - not looking for a cover in the track directory.");
      return Optional.empty();
    }

    try {
      // Get an album for this MPDSong
      MPDAlbum mpdAlbum = mpd.getMusicDatabase().getAlbumDatabase()
          .findAlbum(track.getAlbumName()).iterator().next();
      // Make sure we have a trailing slash
      String musicDirectory =
          (ampdSettings.getMusicDirectory().endsWith("/")) ? ampdSettings.getMusicDirectory()
              : ampdSettings.getMusicDirectory() + "/";
      // Load Artwork for this MPDAlbum
      MPDArtwork artwork = mpd.getArtworkFinder()
          .find(mpdAlbum, musicDirectory).iterator().next();
      LOG.debug("Returning contents of {}", artwork.getName());
      return Optional.of(artwork.getBytes());
    } catch (Exception e) {
      LOG.error("Could not load filename for Track: {}", track);
      return Optional.empty();
    }
  }
}
