export interface ServerStatus {
  audio: string;
  playlistVersion: number;
  bitrate: number;
  volume: number;
  repeat: boolean;
  random: boolean;
  crossfade: boolean;
  elapsedTime: number;
  totalTime: number;
  databaseUpdating: boolean;
  consume: boolean;
  single: boolean;
  status: string[];
  error: string;
  state: string;
}
