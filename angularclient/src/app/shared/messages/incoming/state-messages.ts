import { IServerStatusRoot } from './server-status-root';
import { IStateMsgPayload } from './state-msg-payload';

export class ServerStatusRootImpl implements IServerStatusRoot {
  public payload: IStateMsgPayload;
  public type: string;

  constructor(payload: IStateMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}
