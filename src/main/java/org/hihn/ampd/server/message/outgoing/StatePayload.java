package org.hihn.ampd.server.message.outgoing;

import org.bff.javampd.server.ServerStatus;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.MpdModesPanelMsg;

/**
 * Represents the structure of a state returned to the frontend.
 */
public class StatePayload {

  private MpdModesPanelMsg mpdModesPanelMsg;

  private MPDSong currentTrack;

  private ServerStatus serverStatus;

  /**
   * Message to the frontend that contains information about the current MPD state.
   *
   * @param serverStatus  ServerStatus provided by MPD.
   * @param currentTrack  The currently played track.
   * @param mpdModesPanelMsg Representation of the current state of the MPD modes.
   */
  public StatePayload(final ServerStatus serverStatus, final MPDSong currentTrack,
      final MpdModesPanelMsg mpdModesPanelMsg) {
    this.serverStatus = serverStatus;
    this.currentTrack = currentTrack;
    this.mpdModesPanelMsg = mpdModesPanelMsg;
  }

  public MpdModesPanelMsg getMpdModesPanelMsg() {
    return mpdModesPanelMsg;
  }

  public void setMpdModesPanelMsg(final MpdModesPanelMsg mpdModesPanelMsg) {
    this.mpdModesPanelMsg = mpdModesPanelMsg;
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
