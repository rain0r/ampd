import { IControlPanel } from './control-panel';
import { ICurrentSong } from './current-song';
import { IServerStatus } from './server-status';

export interface IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: ICurrentSong;
  cover?: any;
  controlPanel: IControlPanel;
}

export class StateMsgPayload implements IStateMsgPayload {
  public serverStatus: IServerStatus;
  public currentSong: ICurrentSong;
  public controlPanel: IControlPanel;

  constructor(
    serverStatus: IServerStatus,
    currentSong: ICurrentSong,
    controlPanel: IControlPanel
  ) {
    this.serverStatus = serverStatus;
    this.currentSong = currentSong;
    this.controlPanel = controlPanel;
  }
}
