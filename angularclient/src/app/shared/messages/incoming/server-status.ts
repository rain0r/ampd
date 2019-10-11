export interface IServerStatus {
  audio: string;
  playlistVersion: number;
  bitrate: number;
  volume: number;
  repeat: boolean;
  random: boolean;
  xfade: number;
  elapsedTime: number;
  totalTime: number;
  databaseUpdating: boolean;
  consume: boolean;
  single: boolean;
  status: string[];
  error: string;
  state: string;
}
