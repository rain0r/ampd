package org.hihn.ampd.server.message.outgoing.state;

import org.bff.javampd.server.ServerStatus;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.ControlPanel;

public class StatePayload {

  private ServerStatus serverStatus;

  private MPDSong currentSong;

  private String cover;

  private ControlPanel controlPanel;

  public StatePayload() {
  }

  public StatePayload(ServerStatus serverStatus, MPDSong currentSong,
      ControlPanel controlPanel) {
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

  public ServerStatus getServerStatus() {
    return serverStatus;
  }

  public void setServerStatus(ServerStatus serverStatus) {
    this.serverStatus = serverStatus;
  }

  public MPDSong getCurrentSong() {
    return currentSong;
  }

  public void setCurrentSong(MPDSong currentSong) {
    this.currentSong = currentSong;
  }

  public String getCover() {
    return cover;
  }

  public void setCover(String cover) {
    this.cover = cover;
  }
}
