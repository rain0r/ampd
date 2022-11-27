import { Directory } from "../messages/incoming/directory";
import { Playlist } from "../messages/incoming/playlist";
import { QueueTrack } from "./queue-track";

export interface AmpdBrowsePayload {
  directories: Directory[];
  playlists: Playlist[];
  tracks: QueueTrack[];
}
