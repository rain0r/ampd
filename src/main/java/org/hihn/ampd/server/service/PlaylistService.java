package org.hihn.ampd.server.service;

import java.util.Collection;
import java.util.Optional;
import org.bff.javampd.server.MPD;
import org.bff.javampd.server.MPDConnectionException;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.outgoing.SavePlaylistResponse;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.PlaylistInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Provides methods to manage playlists.
 */
@Service
public class PlaylistService {

  private static final Logger LOG = LoggerFactory.getLogger(PlaylistService.class);

  private final MPD mpd;

  private final AmpdSettings ampdSettings;

  public PlaylistService(final MPD mpd,
      final AmpdSettings ampdSettings) {
    this.mpd = mpd;
    this.ampdSettings = ampdSettings;
  }

  /**
   * Deletes a playlist.
   *
   * @param playlistName Name of the playlist to delete.
   */
  public void deleteByName(String playlistName) {
    if (ampdSettings.isDeleteExistingPlaylists()) {
      mpd.getPlaylist().deletePlaylist(playlistName);
    }
  }

  /**
   * Saves the current queue to a playlist on the MPD server.
   *
   * @param playlistName Name of the new playlist.
   * @return A {@link SavePlaylistResponse}-object containing the search results.
   */
  public SavePlaylistResponse savePlaylist(String playlistName) {
    SavePlaylistResponse response = new SavePlaylistResponse();
    response.setPlaylistName(playlistName);
    if (ampdSettings.isCreateNewPlaylists()) {
      try {
        response.setSuccess(mpd.getPlaylist().savePlaylist(playlistName));
      } catch (MPDConnectionException e) {
        response.setSuccess(false);
        response.setMessage(e.getMessage());
        LOG.error("Failed to create playlist: {}", playlistName, e);
      }
    } else {
      response.setSuccess(false);
      response.setMessage("Saving new playlists is disabled on the server.");
    }
    return response;
  }

  /**
   * Gets info about a playlist from the MPD server.
   *
   * @param name The name of the playlist.
   * @return Info about the specified playlist.
   */
  public Optional<PlaylistInfo> getPlaylistInfo(String name) {
    Optional<PlaylistInfo> ret = Optional.empty();
    try {
      Collection<MPDSong> playlists = mpd.getMusicDatabase().getPlaylistDatabase()
          .listPlaylistSongs(name);
      int trackCount = mpd.getMusicDatabase().getPlaylistDatabase()
          .countPlaylistSongs(name);
      ret = Optional.of(new PlaylistInfo(name, trackCount, playlists));
    } catch (Exception e) {
      LOG.warn("Could not get info about playlist: {}", name);
    }
    return ret;
  }
}
