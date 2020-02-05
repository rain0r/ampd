import { ConnectionConfiguration } from '../../../connection-configuration';

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
  public coverUrl() {
    const cc = ConnectionConfiguration.get();
    const currentCoverUrl = 'find-cover';
    // Add a query param to trigger an image change in the browser
    return `${cc.coverServer}/${currentCoverUrl}?path=${encodeURI(this.path)}`;
  }
}
