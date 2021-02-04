package org.hihn.ampd.server.message.outgoing.state;

import org.bff.javampd.server.ServerStatus;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.ControlPanel;

/**
 * Represents the structure of a state returned to the frontend.
 */
public class StatePayload {

  private ControlPanel controlPanel;

  private String cover;

  private MPDSong currentSong;

  private ServerStatus serverStatus;

  public StatePayload(final ServerStatus serverStatus, final MPDSong currentSong,
      final ControlPanel controlPanel) {
    this.serverStatus = serverStatus;
    this.currentSong = currentSong;
    this.controlPanel = controlPanel;
  }

  public ControlPanel getControlPanel() {
    return controlPanel;
  }

  public void setControlPanel(final ControlPanel controlPanel) {
    this.controlPanel = controlPanel;
  }

  public String getCover() {
    return cover;
  }

  public void setCover(final String cover) {
    this.cover = cover;
  }

  public MPDSong getCurrentSong() {
    return currentSong;
  }

  public void setCurrentSong(final MPDSong currentSong) {
    this.currentSong = currentSong;
  }

  public ServerStatus getServerStatus() {
    return serverStatus;
  }

  public void setServerStatus(final ServerStatus serverStatus) {
    this.serverStatus = serverStatus;
  }
}
