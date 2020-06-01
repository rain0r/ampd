import { IDirectory } from "./directory";
import { IPlaylist } from "./playlist";
import { MpdTrack } from "./mpd-track";

export interface IBrowseMsgPayload {
  directories: IDirectory[];
  tracks: MpdTrack[];
  playlists: IPlaylist[];
}

export interface IBrowseRoot {
  type: string;
  payload: IBrowseMsgPayload;
}
