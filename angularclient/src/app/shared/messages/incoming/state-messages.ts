import {IServerStatusRoot} from "./server-status-root";
import {IStateMsgPayload} from "./state-msg-payload";

export class ServerStatusRootImpl implements IServerStatusRoot {
  payload: IStateMsgPayload;
  type: string;

  constructor(payload: IStateMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}
