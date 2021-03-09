package org.hihn.ampd.server.service;

import org.bff.javampd.server.MPD;
import org.bff.javampd.server.MPDConnectionException;
import org.hihn.ampd.server.config.MpdConfiguration;
import org.hihn.ampd.server.model.AmpdSettings;
import org.hihn.ampd.server.model.http.SavePlaylistResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PlaylistService {

  private static final Logger LOG = LoggerFactory.getLogger(PlaylistService.class);

  private final MPD mpd;

  private final AmpdSettings ampdSettings;


  public PlaylistService(MpdConfiguration mpdConfiguration,
      AmpdSettings ampdSettings) {
    mpd = mpdConfiguration.mpd();
    this.ampdSettings = ampdSettings;
  }

  /**
   * Saves the current queue to a playlist on the MPD server.
   *
   * @param playlistName Name of the new playlist.
   * @return A {@link SavePlaylistResponse} object.
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
        LOG.error("Failed to create playlist: {}", playlistName);
        LOG.error(e.getMessage(), e.getMessage());
      }
    } else {
      response.setSuccess(false);
      response.setMessage("Saving new playlists is disabled on the server.");
    }
    return response;
  }
}
