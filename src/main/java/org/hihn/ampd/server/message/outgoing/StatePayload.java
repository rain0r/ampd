package org.hihn.ampd.server.message.outgoing;

import org.bff.javampd.server.ServerStatus;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.MpdModesPanel;

/**
 * Represents the structure of a state returned to the frontend.
 */
public class StatePayload {

  private MpdModesPanel mpdModesPanel;


  private MPDSong currentTrack;

  private ServerStatus serverStatus;

  public StatePayload(final ServerStatus serverStatus, final MPDSong currentTrack,
      final MpdModesPanel mpdModesPanel) {
    this.serverStatus = serverStatus;
    this.currentTrack = currentTrack;
    this.mpdModesPanel = mpdModesPanel;
  }

  public MpdModesPanel getMpdModesPanel() {
    return mpdModesPanel;
  }

  public void setMpdModesPanel(final MpdModesPanel mpdModesPanel) {
    this.mpdModesPanel = mpdModesPanel;
  }

  public MPDSong getCurrentTrack() {
    return currentTrack;
  }

  public void setCurrentTrack(final MPDSong currentTrack) {
    this.currentTrack = currentTrack;
  }

  public ServerStatus getServerStatus() {
    return serverStatus;
  }

  public void setServerStatus(final ServerStatus serverStatus) {
    this.serverStatus = serverStatus;
  }
}
