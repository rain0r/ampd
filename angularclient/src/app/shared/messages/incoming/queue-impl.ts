import { IMpdSong, QueueRoot } from 'QueueMsg';

export class QueueRootImpl implements QueueRoot {
  public payload: IMpdSong[];
  public type: string;

  constructor(payload: IMpdSong[], type: string) {
    this.payload = payload;
    this.type = type;
  }
}
