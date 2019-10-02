export interface IPlaylist {
  name: string;
  count: number;
}

export class Playlist implements IPlaylist {
  name: string;
  count: number;

  constructor(name: string, count: number) {
    this.name = name;
    this.count = count;
  }
}