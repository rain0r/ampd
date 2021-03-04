/**
 * Bundles the browse-information that was received from the WebSocket-Service.
 * That is playlists, directories and tracks.
 */
import {Directory} from "../messages/incoming/directory";
import {PlaylistImpl} from "../messages/incoming/playlist-impl";
import {QueueTrack} from "./queue-track";

export class BrowseInfo {
  dirQueue: Directory[] = [];
  playlistQueue: PlaylistImpl[] = [];
  trackQueue: QueueTrack[] = [];

  isEmpty(): boolean {
    return (
        this.playlistQueue.length === 0 &&
        this.dirQueue.length === 0 &&
        this.trackQueue.length === 0
    );
  }
}
