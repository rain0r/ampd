import { MpdSong, QueueRoot } from 'QueueMsg';

export class QueueRootImpl implements QueueRoot {
  public payload: MpdSong[];
  public type: string;

  constructor(payload: MpdSong[], type: string) {
    this.payload = payload;
    this.type = type;
  }
}
