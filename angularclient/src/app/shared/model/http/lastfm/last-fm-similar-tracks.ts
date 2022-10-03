import { Track } from "./track";

export interface LastFmSimilarTracks {
  apiKey: string;
  similarTracks: Track[];
}
