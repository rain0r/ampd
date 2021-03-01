/**
 * Bundles the browse-information that was received from the WebSocket-Service.
 * That is playlists, directories and tracks.
 */
import { Directory } from "../messages/incoming/directory";
import { MpdTrack } from "../messages/incoming/mpd-track";
import { PlaylistImpl } from "../messages/incoming/playlist-impl";

export class BrowseInfo {
  dirQueue: Directory[] = [];
  playlistQueue: PlaylistImpl[] = [];
  trackQueue: MpdTrack[] = [];

  isEmpty(): boolean {
    return (
      this.playlistQueue.length === 0 &&
      this.dirQueue.length === 0 &&
      this.trackQueue.length === 0
    );
  }
}
