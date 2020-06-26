import { MpdTrack } from "./mpd-track";

export interface IQueuePayload {
  tracks: MpdTrack[];
  checkSum: number;
}
