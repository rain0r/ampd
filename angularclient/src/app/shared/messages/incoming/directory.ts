import { ConnectionConfig } from '../../connection-config/connection-config';

export interface IDirectory {
  directory: boolean;
  path: string;
  lastModified?: Date;
}

export class Directory implements IDirectory {
  /**
   * How many chars are displayed in the HTML. Long names can break the layout.
   * @type {number}
   */
  public static readonly charsDisplayed: number = 25;

  public directory: boolean;
  public path: string;

  constructor(directory: boolean, path: string) {
    this.directory = directory;
    this.path = path;
  }

  public fullDisplayedPath(): string {
    return (
      this.path
        .trim()
        .split('/')
        .pop() || ''
    );
  }

  public displayedPath(): string {
    let path = this.fullDisplayedPath();
    if (path.length > Directory.charsDisplayed) {
      path = `${path.substr(0, Directory.charsDisplayed)}…`;
    }

    return path;
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
