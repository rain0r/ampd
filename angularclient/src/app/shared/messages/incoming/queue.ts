import { IMpdSong } from './mpd-song';

export interface IQueueRoot {
  payload: IMpdSong[];
  type: string;
}

export class QueueRootImpl implements IQueueRoot {
  public payload: IMpdSong[];
  public type: string;

  constructor(payload: IMpdSong[], type: string) {
    this.payload = payload;
    this.type = type;
  }
}
