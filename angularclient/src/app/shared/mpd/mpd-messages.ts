export interface MpdSong {
  albumName: string;
  artistName: string;
  comment: string;
  discNumber: string;
  file: string;
  genre: string;
  id: number;
  length: number;
  name: string;
  position: number;
  title: string;
  track: number;
  year: string;
}

export interface ServerStatus {
  consume: number;
  crossfade: number;
  currentsongid: number;
  elapsedTime: number;
  random: number;
  repeat: number;
  single: number;
  songpos: number;
  state: string;
  totalTime: number;
  volume: number;
}

export class ControlPanel {
  random: boolean;
  consume: boolean;
  single: boolean;
  crossfade: boolean;
  repeat: boolean;

  constructor() {
    this.random = false;
    this.consume = false;
    this.single = false;
    this.crossfade = false;
    this.repeat = false;
  }
}

export interface State {
  currentSong: MpdSong;
  serverStatus: ServerStatus;
  controlPanel: ControlPanel;
}
