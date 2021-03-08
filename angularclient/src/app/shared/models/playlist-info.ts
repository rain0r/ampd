import { Track } from "../messages/incoming/track";

/**
 * Info about a playlist as received by the backend.
 */
export interface PlaylistInfo {
  name: string;
  trackCount: number;
  tracks: Track[];
}
