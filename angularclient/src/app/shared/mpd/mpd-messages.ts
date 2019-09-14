import * as StateMessage from 'StateMessage';

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

export interface State {
  currentSong: MpdSong;
  serverStatus: StateMessage.ServerStatus;
  controlPanel: StateMessage.ControlPanel;
}
