package org.hihn.ampd.server.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.TreeSet;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.message.outgoing.browse.Directory;
import org.hihn.ampd.server.message.outgoing.browse.Playlist;
import org.hihn.ampd.server.model.http.BrowsePayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class BrowseService {

  private static final Logger LOG = LoggerFactory.getLogger(BrowseService.class);

  private final MPD mpd;

  public BrowseService(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  /**
   * Generell browse request for a path. Includes directories, tracks and playlists.
   *
   * @param path The path to browse
   * @return
   */
  public BrowsePayload browse(String path) {
    /* Remove leading slashes */
    path = path.replaceAll("^/+", "");
    /* Outgoing payload */
    BrowsePayload browsePayload = browseDir(path);
    if (path.trim().length() < 2) {
      /* Only look for playlists if path is '/' or '' */
      browsePayload.addPlaylists(getPlaylists());
    }
    return new BrowsePayload();
    // return browsePayload;
  }

  public BrowsePayload browseDir(String path) {
    BrowsePayload browsePayload = new BrowsePayload();
    // Build a MPDFile from the input path
    MPDFile startDir = new MPDFile(path);
    startDir.setDirectory(true);
    Collection<MPDFile> foundFiles = new ArrayList<>();
    try {
      foundFiles = mpd.getMusicDatabase().getFileDatabase().listDirectory(startDir);
    } catch (Exception e) {
      LOG.error("Error listing directory '{}'", path);
      LOG.error(e.getMessage(), e);
    }
    for (MPDFile file : foundFiles) {
      if (file.isDirectory()) {
        Directory d = new Directory(file.getPath());
        browsePayload.addDirectory(d);
      } else {
        Collection<MPDSong> searchResults =
            mpd.getMusicDatabase().getSongDatabase().searchFileName(file.getPath());
        if (!searchResults.isEmpty()) {
          browsePayload.addTrack(searchResults.iterator().next());
        }
      }
    }
    return browsePayload;
  }

  private Collection<Playlist> getPlaylists() {
    TreeSet<Playlist> ret = new TreeSet<>();
    Collection<String> playlists = mpd.getMusicDatabase().getPlaylistDatabase()
        .listPlaylists();
    for (String playlist : playlists) {
      int count = mpd.getMusicDatabase().getPlaylistDatabase().countPlaylistSongs(playlist);
      ret.add(new Playlist(playlist, count));
    }
    return ret;
  }


}
