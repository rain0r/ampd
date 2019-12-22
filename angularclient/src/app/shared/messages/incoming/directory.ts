export interface IDirectory {
  directory: boolean;
  path: string;
  lastModified?: Date;
  albumCover: string;
}

export class Directory implements IDirectory {
  public directory: boolean;
  public path: string;
  public albumCover: string;

  constructor(directory: boolean, path: string, albumCover: string) {
    this.directory = directory;
    this.path = path;
    this.albumCover = albumCover;
  }
  public displayedPath() {
    return (
      this.path
        .trim()
        .split('/')
        .pop() || ''
    );
  }
}
