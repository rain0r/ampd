import { ConnectionConfig } from '../../connection-config/connection-config';

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
    let foo =
      this.path
        .trim()
        .split('/')
        .pop() || '';

    if (foo.length > 29) {
      foo = `${foo.substr(0, 29)}…`;
    }

    return foo;
  }

  public coverUrl() {
    const cc = ConnectionConfig.get();
    const currentCoverUrl = 'find-cover';
    // Add a query param to trigger an image change in the browser
    return `${cc.backendAddr}/${currentCoverUrl}?path=${encodeURIComponent(
      this.path
    )}`;
  }
}
