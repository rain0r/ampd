import { Pageable, Sort } from "./../../model/pageable";
import { Track } from "./track";

export interface QueueResponse {
  content: Track[];
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
