import { Track } from "../../messages/incoming/track";

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface AdvSearchResponse {
  content: Track[];
  pageable: string;
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
