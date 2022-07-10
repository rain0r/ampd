import { Track } from "../../messages/incoming/track";
import { MpdAlbum } from "./album";

export interface GenresPayload {
  genre: string;
  tracks: Track[];
  albums: MpdAlbum[];
}
