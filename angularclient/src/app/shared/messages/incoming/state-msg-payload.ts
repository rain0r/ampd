import { IControlPanel } from "./control-panel";
import { IMpdTrack } from "./mpd-track";
import { IServerStatus } from "./server-status";

export interface IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: IMpdTrack;
  cover?: unknown;
  controlPanel: IControlPanel;
}
