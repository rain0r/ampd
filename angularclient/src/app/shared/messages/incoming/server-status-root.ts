import { IStateMsgPayload } from './state-msg-payload';

export interface IServerStatusRoot {
  payload: IStateMsgPayload;
  type: string;
}
