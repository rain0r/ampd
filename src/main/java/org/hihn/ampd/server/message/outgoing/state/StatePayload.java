package org.hihn.ampd.server.message.outgoing.state;

import org.bff.javampd.server.ServerStatus;
import org.bff.javampd.song.MpdSong;
import org.hihn.ampd.server.message.incoming.ControlPanel;

/**
 * Represents the structure of a state returned to the frontend.
 */
public class StatePayload {

  private ControlPanel controlPanel;
  private String cover;
  private MpdSong currentSong;
  private ServerStatus serverStatus;

  public StatePayload() {
  }

  public StatePayload(ServerStatus serverStatus, MpdSong currentSong, ControlPanel controlPanel) {
    this.serverStatus = serverStatus;
    this.currentSong = currentSong;
    this.controlPanel = controlPanel;
  }

  public ControlPanel getControlPanel() {
    return controlPanel;
  }

  public void setControlPanel(ControlPanel controlPanel) {
    this.controlPanel = controlPanel;
  }

  public String getCover() {
    return cover;
  }

  public void setCover(String cover) {
    this.cover = cover;
  }

  public MpdSong getCurrentSong() {
    return currentSong;
  }

  public void setCurrentSong(MpdSong currentSong) {
    this.currentSong = currentSong;
  }

  public ServerStatus getServerStatus() {
    return serverStatus;
  }

  public void setServerStatus(ServerStatus serverStatus) {
    this.serverStatus = serverStatus;
  }
}
