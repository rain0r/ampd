import { BrowseMsgPayload, BrowseRoot, Directory } from 'BrowseMsg';
import { ConnectionConfiguration } from '../../../connection-configuration';

export class DirectoryImpl implements Directory {
  directory: boolean;
  path: string;
  albumCover: string;
  noCover: boolean = false;

  constructor(directory: boolean, path: string, albumCover: string) {
    this.directory = directory;
    this.path = path;
    this.albumCover = albumCover;
  }

  getAlbumCover() {
    // return this.albumCover ? 'data:image/jpg;base64,' + this.albumCover : '';
    const cc = ConnectionConfiguration.get();
    const currentCoverUrl = 'find-cover';
    return `${cc.coverServer}/${currentCoverUrl}?path=${this.path}`;
  }

  displayedPath() {
    return (
      this.path
        .trim()
        .split('/')
        .pop() || ''
    );
  }
}

export class BrowseRootImpl implements BrowseRoot {
  payload: BrowseMsgPayload;
  type: string;

  constructor(payload: BrowseMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}
