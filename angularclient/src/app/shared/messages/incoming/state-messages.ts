import {IStateMsgPayload} from './state-msg-payload';
import {IServerStatusRoot} from "./server-status-root";

export class ServerStatusRootImpl implements IServerStatusRoot {
  public payload: IStateMsgPayload;
  public type: string;

  constructor(payload: IStateMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}
