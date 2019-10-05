import { IMpdTrack } from './mpd-track';

export interface IQueueRoot {
  payload: IMpdTrack[];
  type: string;
}

export class QueueRootImpl implements IQueueRoot {
  public payload: IMpdTrack[];
  public type: string;

  constructor(payload: IMpdTrack[], type: string) {
    this.payload = payload;
    this.type = type;
  }
}
