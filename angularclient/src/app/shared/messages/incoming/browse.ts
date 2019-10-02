import {IPlaylist} from './playlist';
import {IDirectory} from "./directory";

export interface IBrowseMsgPayload {
  directories: IDirectory[];
  songs: any[];
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
