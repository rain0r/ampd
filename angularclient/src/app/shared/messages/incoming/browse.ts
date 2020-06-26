import { IDirectory } from "./directory";
import { MpdTrack } from "./mpd-track";
import { IPlaylist } from "./playlist";

export interface IBrowseMsgPayload {
  directories: IDirectory[];
  tracks: MpdTrack[];
  playlists: IPlaylist[];
}
