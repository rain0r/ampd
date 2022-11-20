import { Track } from "../../messages/incoming/track";
import { Pageable, Sort } from "../pageable";

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
