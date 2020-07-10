import { MpdTrack } from "../messages/incoming/mpd-track";

export interface PlaylistInfo {
  name: string;
  trackCount: number;
  tracks: MpdTrack[];
}
