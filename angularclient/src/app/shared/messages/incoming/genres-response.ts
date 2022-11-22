import { Sort } from "@angular/material/sort";
import { MpdAlbum } from "../../model/http/album";
import { Pageable } from "../../model/pageable";
import { Track } from "./track";

export interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  empty: boolean;
  totalPlayTime: number;
}

export interface GenreResponse {
  genre: string;
  tracks: PaginatedResponse<Track>;
  albums: PaginatedResponse<MpdAlbum>;
}
