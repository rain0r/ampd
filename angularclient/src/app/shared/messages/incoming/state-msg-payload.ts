import { MpdModesPanel } from "./mpd-modes-panel";
import { Track } from "./track";
import { ServerStatus } from "./server-status";

export interface StateMsgPayload {
  serverStatus: ServerStatus;
  currentTrack: Track;
  cover?: unknown;
  controlPanel: MpdModesPanel;
}
