import { BrowseMsgPayload, BrowseRoot, Directory } from 'BrowseMsg';
import { ConnectionConfiguration } from '../../../connection-configuration';

export class DirectoryImpl implements Directory {
  public directory: boolean;
  public path: string;
  public albumCover: string;
  public noCover: boolean = false;

  constructor(directory: boolean, path: string, albumCover: string) {
    this.directory = directory;
    this.path = path;
    this.albumCover = albumCover;
  }

  public getAlbumCover() {
    // return this.albumCover ? 'data:image/jpg;base64,' + this.albumCover : '';
    const cc = ConnectionConfiguration.get();
    const currentCoverUrl = 'find-cover';
    return `${cc.coverServer}/${currentCoverUrl}?path=${this.path}`;
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

export class BrowseRootImpl implements BrowseRoot {
  public payload: BrowseMsgPayload;
  public type: string;

  constructor(payload: BrowseMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}
