export interface IDirectory {
  directory: boolean;
  path: string;
  lastModified?: Date;
}

export class Directory implements IDirectory {
  public directory: boolean;
  public path: string;

  constructor(directory: boolean, path: string) {
    this.directory = directory;
    this.path = path;
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
