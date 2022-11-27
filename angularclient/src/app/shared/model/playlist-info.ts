import { PaginatedResponse } from "../messages/incoming/paginated-response";
import { Track } from "../messages/incoming/track";

/**
 * Info about a playlist as received by the backend.
 */
export interface PlaylistInfo {
  name: string;
  tracks: PaginatedResponse<Track>;
}
