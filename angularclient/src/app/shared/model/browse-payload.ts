/**
 * Bundles the browse-information that was received from the WebSocket-Service.
 * That is playlists, directories and tracks.
 */
import { Directory } from "../messages/incoming/directory";
import { Playlist } from "../messages/incoming/playlist";
import { Track } from "../messages/incoming/track";
import { QueueTrack } from "./queue-track";

export interface BrowsePayload {
  directories: Directory[];
  playlists: Playlist[];
  tracks: Track[];
  dirParam: string;
}

export interface AmpdBrowsePayload extends BrowsePayload {
  queueTracks: QueueTrack[];
  isTracksOnlyDir: boolean;
  dirUp: string;
}
