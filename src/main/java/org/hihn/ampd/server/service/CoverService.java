package org.hihn.ampd.server.service;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
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

  /**
   * Methods to load album artworks from the music directory.
   *
   * @param ampdSettings      Settings of this ampd instance.
   * @param mpd               Represents a connection to a MPD server.
   * @param coverCacheService Handles locally saved albumart / covers.
   * @param mbCoverService    Service to download cover from MusicBrainz.
   */
  public CoverService(final AmpdSettings ampdSettings, final MPD mpd,
      CoverCacheService coverCacheService,
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
      track = mpd.getMusicDatabase().getSongDatabase().searchFileName(trackFilePath).iterator()
          .next();
    } catch (NoSuchElementException e) {
      LOG.warn("Could not find MPDSong for file: {}", trackFilePath);
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

  public Optional<byte[]> findAlbumCoverForAlbum(String albumName, String artistName) {
    MPDAlbum mpdAlbum = new MPDAlbum(albumName, artistName);
    String prefix =
        ampdSettings.getMusicDirectory().endsWith("/") ? ampdSettings.getMusicDirectory()
            : ampdSettings.getMusicDirectory() + "/";
    List<MPDArtwork> ret = mpd.getArtworkFinder()
        .find(mpdAlbum, prefix);
    if (ret.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(ret.get(0).getBytes());
  }

  /**
   * Looks in a specific directory for a cover.
   *
   * @param dirPath The directory that contains a cover.
   * @return The content of the found cover.
   */
  public Optional<byte[]> loadArtworkForDir(final String dirPath) {
    try {
      // Build the full path to search for the artwork that is the MPD music_directory + dirPath
      final Path path = Paths.get(ampdSettings.getMusicDirectory(), dirPath);
      MPDArtwork artwork = mpd.getArtworkFinder().find(path.toString()).iterator().next();
      return Optional.of(artwork.getBytes());
    } catch (Exception e) {
      LOG.error("Could not load filename for Track: {}", dirPath);
    }
    return Optional.empty();
  }

  /**
   * See if the path of track leads to an album directory and try to load the cover.
   *
   * @param track The track to find the artwork for.
   * @return The bytes of the found cover.
   */
  private Optional<byte[]> loadArtworkForTrack(final MPDSong track) {
    try {
      return loadMusicDirCover(track.getFile());
    } catch (Exception e) {
      LOG.error("Could not load artwork for track: {}", track, e);
      return Optional.empty();
    }
  }

  /**
   * Try to find a cover file in the directory of the track.
   *
   * @param trackFilePath The file path of a track.
   * @return Cover as bytes or an empty optional if no cover was found.
   */
  private Optional<byte[]> loadMusicDirCover(final String trackFilePath) {
    // Only look for local covers if a music directory is set
    if (ampdSettings.getMusicDirectory().equals("")) {
      LOG.debug("musicDirectory is empty - not looking for a cover in the track directory.");
      return Optional.empty();
    }
    LOG.debug("Looking for a cover in the directory of file: {}", trackFilePath);
    final Path path = Paths.get(ampdSettings.getMusicDirectory(), trackFilePath);
    Path parent = path.getParent();
    if (parent == null) {
      return Optional.empty();
    }
    final List<Path> covers = new ArrayList<>();
    try (final DirectoryStream<Path> stream = Files
        .newDirectoryStream(parent, ampdSettings.getArtworkFilenamePattern())) {
      stream.forEach(covers::add);
    } catch (final IOException e) {
      LOG.debug("No covers found in: {}", path);
      return Optional.empty();
    }
    try {
      return Optional.of(Files.readAllBytes(covers.get(0)));
    } catch (final Exception e) {
      return Optional.empty();
    }
  }
}
