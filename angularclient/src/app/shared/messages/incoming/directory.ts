import { SafeResourceUrl } from '@angular/platform-browser';
import { ConnectionConfiguration } from '../../../connection-configuration';

export interface IDirectory {
  directory: boolean;
  path: string;
  lastModified?: Date;
  albumCover: SafeResourceUrl;
}

export class Directory implements IDirectory {
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
