import { AdvSearchResponse } from "./http/adv-search-response";

/**
 * Info about a playlist as received by the backend.
 */
export interface PlaylistInfo {
  name: string;
  tracks: AdvSearchResponse;
}
