export interface Playlist {
  name: string;
  count: number;
}

export class PlaylistImpl implements Playlist {
  name: string;
  count: number;

  constructor(name: string, count: number) {
    this.name = name;
    this.count = count;
  }
}
