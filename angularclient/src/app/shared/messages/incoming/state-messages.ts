declare module 'StateMsg' {
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

  export interface ICurrentSong {
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

  export interface IControlPanel {
    random: boolean;
    consume: boolean;
    single: boolean;
    crossfade: boolean;
    repeat: boolean;
    xfade: number;
  }

  export interface IStateMsgPayload {
    serverStatus: IServerStatus;
    currentSong: ICurrentSong;
    cover?: any;
    controlPanel: IControlPanel;
  }

  export interface IServerStatusRoot {
    payload: IStateMsgPayload;
    type: string;
  }
}
