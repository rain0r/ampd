import {IMpdTrack} from "./mpd-track";

export interface IQueuePayload {
  tracks: IMpdTrack[];
  checkSum: number;
}