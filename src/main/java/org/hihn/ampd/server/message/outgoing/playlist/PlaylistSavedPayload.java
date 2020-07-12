package org.hihn.ampd.server.message.outgoing.playlist;

public class PlaylistSavedPayload {

  private final String playlistName;

  private final boolean success;

  public PlaylistSavedPayload(final String playlistName, final boolean success) {
    this.playlistName = playlistName;
    this.success = success;
  }

  public String getPlaylistName() {
    return playlistName;
  }

  public boolean isSuccess() {
    return success;
  }
}
