import { Track } from "../../messages/incoming/track";

export interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface AdvSearchResponse {
  content: Track[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  size: number;
  empty: boolean;
}
