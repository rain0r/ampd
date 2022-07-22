import { TrackMetadata } from "./track-metadata";

export interface Listen {
  insertedAt: number;
  listenedAt: number;
  recordingMsid: string;
  trackMetadata: TrackMetadata;
  userName: string;
}
