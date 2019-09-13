package org.hihn.ampd.server.service;

import org.bff.javampd.album.MPDAlbum;
import org.bff.javampd.art.MPDArtwork;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import static org.hihn.ampd.server.service.CoverCacheService.COVER_TYPE.ALBUM;
import static org.hihn.ampd.server.service.CoverCacheService.COVER_TYPE.SINGLETON;
import static org.hihn.ampd.server.util.AmpdUtils.loadFile;

@Service
public class CoverArtFetcherService {

  private static final Logger LOG = LoggerFactory.getLogger(CoverArtFetcherService.class);

  private final FileStorageService fileStorageService;

  private final CoverCacheService coverCacheService;

  private final MPD mpd;

  public CoverArtFetcherService(FileStorageService fileStorageService,
      CoverCacheService coverCacheService, MpdConfiguration mpdConfiguration) {

    this.fileStorageService = fileStorageService;
    this.coverCacheService = coverCacheService;
    this.mpd = mpdConfiguration.mpd();
  }

  public Optional<byte[]> getAlbumCover() {
    MPDSong song = mpd.getPlayer().getCurrentSong();
    CoverCacheService.COVER_TYPE coverType = (song.getAlbumName().isEmpty()) ? SINGLETON : ALBUM;

    // Try to load the cover from cache
    Optional<byte[]> cover =
        coverCacheService.loadCover(coverType, song.getArtistName(), song.getTitle());

    // If the cover is not in the cache, try to load it from the MPD music directory
    if (!cover.isPresent()) {
      String songFilePath = song.getFile();
      cover = fileStorageService.loadFileAsResource(songFilePath);
    }

    // Now check the musicbrainz cover api
    if (!cover.isPresent()) {
      cover = downloadCover();
    }

    // Save the cover in the cache
    if (cover.isPresent()) {
      coverCacheService.saveCover(coverType, song.getArtistName(), song.getTitle(), cover.get());
    }

    // Show a transparent image
    if (!cover.isPresent()) {
      cover = loadFallbackCover();
    }

    return cover;
  }

  private Optional<byte[]> loadFallbackCover() {
    Path transparentFile = Paths.get(getClass().getResource("/transparent.png").getFile());
    return loadFile(transparentFile);
  }


  private Optional<byte[]> downloadCover() {
    MPDSong song = mpd.getPlayer().getCurrentSong();
    Collection<MPDAlbum> albums =
        mpd.getMusicDatabase().getAlbumDatabase().findAlbum(song.getAlbumName());

    MPDAlbum foundAlbum =
        albums.stream().filter(album -> song.getArtistName().equals(album.getArtistName()))
            .findFirst().orElse(null);

    if (foundAlbum != null) {
      List<MPDArtwork> foundArtworks = mpd.getArtworkFinder().find(foundAlbum);
      if (foundArtworks.size() > 0) {
        MPDArtwork artwork = foundArtworks.get(0);
        return Optional.of(artwork.getBytes());
      }
    }

    return Optional.empty();
  }
}
