import { Track } from "./track";

export interface QueuePayload {
  tracks: Track[];
  checkSum: number;
}
