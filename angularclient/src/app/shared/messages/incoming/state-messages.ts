declare module 'StateMsg' {
  export interface ServerStatus {
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

  export interface CurrentSong {
    name: string;
    title: string;
    artistName: string;
    albumName: string;
    file: string;
    genre: string;
    comment: string;
    year: string;
    discNumber: string;
    length: number;
    track: number;
    position: number;
    id: number;
  }

  export interface ControlPanel {
    random: boolean;
    consume: boolean;
    single: boolean;
    crossfade: boolean;
    repeat: boolean;
    xfade: number;
  }

  export interface StateMsgPayload {
    serverStatus: ServerStatus;
    currentSong: CurrentSong;
    cover?: any;
    controlPanel: ControlPanel;
  }

  export interface ServerStatusRoot {
    payload: StateMsgPayload;
    type: string;
  }
}
