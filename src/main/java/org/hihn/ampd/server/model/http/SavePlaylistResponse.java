package org.hihn.ampd.server.model.http;

public class SavePlaylistResponse {

  private String playlistName;

  private boolean success;

  private String message;

  public SavePlaylistResponse() {
  }

  public String getPlaylistName() {
    return playlistName;
  }

  public void setPlaylistName(String playlistName) {
    this.playlistName = playlistName;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
