import { IControlPanel } from "./control-panel";
import { IMpdTrack } from "./mpd-track";
import { IServerStatus } from "./server-status";

export interface IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: IMpdTrack;
  cover?: any;
  controlPanel: IControlPanel;
}

export class StateMsgPayload implements IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: IMpdTrack;
  controlPanel: IControlPanel;

  constructor(
    serverStatus: IServerStatus,
    currentSong: IMpdTrack,
    controlPanel: IControlPanel
  ) {
    this.serverStatus = serverStatus;
    this.currentSong = currentSong;
    this.controlPanel = controlPanel;
  }
}
