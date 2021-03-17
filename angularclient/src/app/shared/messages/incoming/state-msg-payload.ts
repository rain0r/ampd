import { MpdModesPanel } from "./mpd-modes-panel";
import { Track } from "./track";
import { ServerStatus } from "./server-status";

export interface StateMsgPayload {
  mpdModesPanel: MpdModesPanel;
  currentTrack: Track;
  serverStatus: ServerStatus;
}
