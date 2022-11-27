import { Sort } from "@angular/material/sort";
import { Pageable } from "../../model/pageable";

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
