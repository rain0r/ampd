export interface Track {
  name: string;
  url: string;
  mbid: string;
  playcount: number;
  userPlaycount: number;
  listeners: number;
  streamable: boolean;
  percentageChange: number;
  tags: string[];
  similarityMatch: number;
  artist: string;
  artistMbid: string;
  position: number;
  fullTrackAvailable: boolean;
  nowPlaying: boolean;
  duration: number;
}
