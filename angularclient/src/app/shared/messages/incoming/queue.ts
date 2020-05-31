import { IMpdTrack } from "./mpd-track";

export interface IQueueRoot {
  type: string;
  payload: IQueuePayload;
}

export interface IQueuePayload {
  tracks: IMpdTrack[];
  checkSum: number;
}

export class QueueRootImpl implements IQueueRoot {
  type: string;
  payload: IQueuePayload;

  constructor(type: string, payload: IQueuePayload) {
    this.type = type;
    this.payload = payload;
  }
}
