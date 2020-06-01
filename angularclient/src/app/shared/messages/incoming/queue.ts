import {IMpdTrack} from "./mpd-track";

export interface IQueueRoot {
  type: string;
  payload: IQueuePayload;
}

export interface IQueuePayload {
  tracks: IMpdTrack[];
  checkSum: number;
}