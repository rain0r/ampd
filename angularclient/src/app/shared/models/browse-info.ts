/**
 * Bundles the browse-information that was received from the WebSocket-Service.
 * That is playlists, directories and tracks.
 */
import { Directory } from '../messages/incoming/directory';
import { MpdTrack } from '../messages/incoming/mpd-track';
import { Playlist } from '../messages/incoming/playlist';

export class BrowseInfo {
  public dirQueue: Directory[] = [];
  public playlistQueue: Playlist[] = [];
  public trackQueue: MpdTrack[] = [];

  public clearAll() {
    this.dirQueue = [];
    this.playlistQueue = [];
    this.trackQueue = [];
  }
}
