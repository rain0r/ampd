import { MpdAlbum } from "../../model/http/album";
import { PaginatedResponse } from "./paginated-response";
import { Track } from "./track";

export interface GenreResponse {
  genre: string;
  tracks: PaginatedResponse<Track>;
  albums: PaginatedResponse<MpdAlbum>;
}
