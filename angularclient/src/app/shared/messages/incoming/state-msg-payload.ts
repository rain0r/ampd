import {IControlPanel} from './control-panel';
import {IServerStatus} from './server-status';
import {IMpdTrack} from "./mpd-track";

export interface IStateMsgPayload {
  serverStatus: IServerStatus;
  currentSong: IMpdTrack;
  cover?: any;
  controlPanel: IControlPanel;
}

export class StateMsgPayload implements IStateMsgPayload {
  public serverStatus: IServerStatus;
  public currentSong: IMpdTrack;
  public controlPanel: IControlPanel;

  constructor(serverStatus: IServerStatus,
              currentSong: IMpdTrack,
              controlPanel: IControlPanel) {
    this.serverStatus = serverStatus;
    this.currentSong = currentSong;
    this.controlPanel = controlPanel;
  }
}
