package org.hihn.ampd.server.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.bff.javampd.file.MPDFile;
import org.bff.javampd.server.MPD;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.controller.ws.QueueController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Provides methods to manage the queue.
 */
@Service
public class QueueService {

  private static final Logger LOG = LoggerFactory.getLogger(QueueController.class);

  private final MPD mpd;

  public QueueService(MpdConfiguration mpdConfiguration) {
    mpd = mpdConfiguration.mpd();
  }

  public void addTrack(String file) {
    MPDFile mpdFile = new MPDFile(file);
    mpdFile.setDirectory(false);
    mpd.getPlaylist().addFileOrDirectory(mpdFile);
  }

  public void addTracks(ArrayList<String> tracks) {
    for (String file : tracks) {
      addTrack(file);
    }
  }

  public void playTrack(String path) {
    List<MPDSong> trackList = mpd.getPlaylist().getSongList();
    Collection<MPDSong> mpdSongCollection =
        mpd.getMusicDatabase().getSongDatabase().searchFileName(path);
    List<MPDSong> result =
        trackList.stream().filter(mpdSongCollection::contains).collect(Collectors.toList());
    if (result.size() > 0) {
      mpd.getPlayer().playSong(result.iterator().next());
    } else {
      LOG.warn("Track not found: " + path);
    }
  }

}
