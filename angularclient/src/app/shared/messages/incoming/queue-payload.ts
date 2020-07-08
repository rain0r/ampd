import { MpdTrack } from "./mpd-track";

export interface QueuePayload {
  tracks: MpdTrack[];
  checkSum: number;
}
