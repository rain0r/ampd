import { QueueTrack } from "../models/queue-track";

export interface SavePlaylistData {
  name: string;
  tracks: QueueTrack[];
}
