import { Track } from "./track";

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface QueueResponse {
  content: Track[];
  pageable: string;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  sort: Sort;
  number: number;
  empty: boolean;
}
