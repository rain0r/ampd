import { IDirectory } from './directory';
import { IPlaylist } from './playlist';

export interface IBrowseMsgPayload {
  directories: IDirectory[];
  tracks: any[];
  playlists: IPlaylist[];
}

export interface IBrowseRoot {
  type: string;
  payload: IBrowseMsgPayload;
}

export class BrowseRootImpl implements IBrowseRoot {
  public payload: IBrowseMsgPayload;
  public type: string;

  constructor(payload: IBrowseMsgPayload, type: string) {
    this.payload = payload;
    this.type = type;
  }
}
