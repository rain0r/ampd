package org.hihn.ampd.server.service;

import static org.hihn.ampd.server.service.CoverCacheService.CoverType.ALBUM;
import static org.hihn.ampd.server.service.CoverCacheService.CoverType.SINGLETON;
import static org.hihn.ampd.server.util.AmpdUtils.loadFile;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.art.MPDArtwork;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.service.CoverCacheService.CoverType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Looks for album art and covers.
 */
@Service
public class CoverArtFetcherService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private final FileStorageService fileStorageService;

  private final CoverCacheService coverCacheService;

  private final MPD mpd;

  @Value("${mpd.music.directory:}")
  // ':' sets an empty str if the prop is not set
  private String musicDirectory;

  @SuppressWarnings("checkstyle:missingjavadocmethod")
  public CoverArtFetcherService(
      FileStorageService fileStorageService,
      CoverCacheService coverCacheService,
      MpdConfiguration mpdConfiguration) {

    this.fileStorageService = fileStorageService;
    this.coverCacheService = coverCacheService;
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

    CoverType coverType = (track.getAlbumName().isEmpty()) ? SINGLETON : ALBUM;

    // Try to load the cover from cache
    Optional<byte[]> cover =
        coverCacheService.loadCover(coverType, track.getArtistName(), track.getTitle());

    // If the cover is not in the cache, try to load it from the MPD music directory
    if (!cover.isPresent()) {
      String trackFilePath = track.getFile();
      cover = fileStorageService.loadFileAsResource(trackFilePath);
    }

    // Now check the musicbrainz cover api
    if (!cover.isPresent()) {
      cover = downloadCover();
    }

    // Save the cover in the cache
    if (cover.isPresent()) {
      coverCacheService.saveCover(coverType, track.getArtistName(), track.getTitle(), cover.get());
    }

    return cover;
  }

  private Optional<byte[]> downloadCover() {
    MPDSong track = mpd.getPlayer().getCurrentSong();
    Collection<MPDAlbum> albums =
        mpd.getMusicDatabase().getAlbumDatabase().findAlbum(track.getAlbumName());

    MPDAlbum foundAlbum =
        albums
            .stream()
            .filter(album -> track.getArtistName().equals(album.getArtistName()))
            .findFirst()
            .orElse(null);

    if (foundAlbum != null && !StringUtils.isEmpty(foundAlbum.toString())) {
      try {
        List<MPDArtwork> foundArtworks = mpd.getArtworkFinder().find(foundAlbum);
        if (foundArtworks.size() > 0) {
          MPDArtwork artwork = foundArtworks.get(0);
          return Optional.of(artwork.getBytes());
        }
      } catch (Exception e) {
        LOG.warn("Could not download cover for: '{}'", foundAlbum);
      }
    }

    return Optional.empty();
  }

  /**
   * See if path leads to an album directory and try to load the cover.
   *
   * @param trackFilePath The file path of a track.
   * @return The bytes of the found cover.
   */
  public byte[] findAlbumCover(Optional<String> trackFilePath) {

    if (!trackFilePath.isPresent()) {
      return null;
    }

    List<Path> covers = new ArrayList<>();
    Path path = Paths.get(musicDirectory, trackFilePath.get());

    try (DirectoryStream<Path> stream = Files.newDirectoryStream(path, "cover.{jpg,jpeg,png}")) {
      stream.forEach(file -> covers.add(file));
    } catch (IOException e) {
      LOG.info("Could not load art in {}", path, e);
    }
    if (covers.size() > 0) {
      Path coverPath = covers.get(0);
      return loadFile(coverPath);
    }

    return null;
  }
}
