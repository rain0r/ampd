import {IControlPanel} from "./control-panel";
import {IServerStatus} from "./server-status";
import {ICurrentSong} from "./current-song";

export interface IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: ICurrentSong;
  cover?: any;
  controlPanel: IControlPanel;
}

export class StateMsgPayload implements IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: ICurrentSong;
  controlPanel: IControlPanel;

  constructor(serverStatus: IServerStatus, currentSong: ICurrentSong, controlPanel: IControlPanel) {
    this.serverStatus = serverStatus;
    this.currentSong = currentSong;
    this.controlPanel = controlPanel;
  }
}