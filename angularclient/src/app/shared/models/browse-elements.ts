export class Directory {
  splittedDir: string = '';
  path: string = '';
  artist: string = '';

  constructor(splittedDir: string, path: string, artist: string) {
    this.splittedDir = splittedDir;
    this.path = path;
    this.artist = artist;
  }
}

export class Playlist {
  name: string = '';
  count: number = 0;
}
