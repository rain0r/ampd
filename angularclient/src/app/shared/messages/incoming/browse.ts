import { Directory } from "./directory";
import { MpdTrack } from "./mpd-track";
import { Playlist } from "./playlist-impl";

export interface BrowseMsgPayload {
  directories: Directory[];
  tracks: MpdTrack[];
  playlists: Playlist[];
}
