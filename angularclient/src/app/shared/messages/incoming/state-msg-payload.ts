import { MpdModesPanel } from "./mpd-modes-panel";
import { Track } from "./track";
import { ServerStatus } from "./server-status";

export interface StateMsgPayload {
  mpdModesPanelMsg: MpdModesPanel;
  currentTrack: Track;
  serverStatus: ServerStatus;
}
