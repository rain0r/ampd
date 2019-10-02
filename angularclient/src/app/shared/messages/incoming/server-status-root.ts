import {IStateMsgPayload} from "./state-msg-payload";

export interface IServerStatusRoot {
  payload: IStateMsgPayload;
  type: string;
}

export class ServerStatusRoot implements IServerStatusRoot {
  payload: IStateMsgPayload;
  type: string;

  constructor(payload: IStateMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}