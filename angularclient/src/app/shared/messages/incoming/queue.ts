declare module 'QueueMsg' {
  export interface IMpdSong {
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

  export interface QueueRoot {
    payload: IMpdSong[];
    type: string;
  }
}
