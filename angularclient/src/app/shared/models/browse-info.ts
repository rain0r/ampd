/**
 * Bundles the browse-information that was received from the WebSocket-Service.
 * That is playlists, directories and tracks.
 */
import { DirectoryImpl } from "../messages/incoming/directory-impl";
import { MpdTrack } from "../messages/incoming/mpd-track";
import { PlaylistImpl } from "../messages/incoming/playlist-impl";

export class BrowseInfo {
  dirQueue: DirectoryImpl[] = [];
  playlistQueue: PlaylistImpl[] = [];
  trackQueue: MpdTrack[] = [];
}
