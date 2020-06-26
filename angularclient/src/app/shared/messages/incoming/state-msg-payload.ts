import { IControlPanel } from "./control-panel";
import { MpdTrack } from "./mpd-track";
import { IServerStatus } from "./server-status";

export interface IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: MpdTrack;
  cover?: unknown;
  controlPanel: IControlPanel;
}
