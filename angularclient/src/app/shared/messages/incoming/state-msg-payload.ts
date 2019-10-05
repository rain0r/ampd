import { IControlPanel } from './control-panel';
import { ICurrentTrack } from './current-track';
import { IServerStatus } from './server-status';

export interface IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: ICurrentTrack;
  cover?: any;
  controlPanel: IControlPanel;
}

export class StateMsgPayload implements IStateMsgPayload {
  public serverStatus: IServerStatus;
  public currentSong: ICurrentTrack;
  public controlPanel: IControlPanel;

  constructor(
    serverStatus: IServerStatus,
    currentSong: ICurrentTrack,
    controlPanel: IControlPanel
  ) {
    this.serverStatus = serverStatus;
    this.currentSong = currentSong;
    this.controlPanel = controlPanel;
  }
}
