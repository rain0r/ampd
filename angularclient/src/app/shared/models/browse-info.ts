/**
 * Bundles the browse-information that was received from the WebSocket-Service.
 * That is playlists, directories and tracks.
 */
import {Directory} from "../messages/incoming/directory";
import {MpdTrack} from "../messages/incoming/mpd-track";
import {Playlist} from "../messages/incoming/playlist";

export class BrowseInfo {
  dirQueue: Directory[] = [];
  playlistQueue: Playlist[] = [];
  trackQueue: MpdTrack[] = [];

  clearAll(): void {
    this.dirQueue = [];
    this.playlistQueue = [];
    this.trackQueue = [];
  }
}
