import { ControlPanel } from "./control-panel";
import { Track } from "./track";
import { ServerStatus } from "./server-status";

export interface StateMsgPayload {
  serverStatus: ServerStatus;
  currentTrack: Track;
  cover?: unknown;
  controlPanel: ControlPanel;
}
