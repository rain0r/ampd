import { MpdSong, QueueRoot } from 'QueueMsg';

export class QueueRootImpl implements QueueRoot {
  payload: MpdSong[];
  type: string;

  constructor(payload: MpdSong[], type: string) {
    this.payload = payload;
    this.type = type;
  }
}
