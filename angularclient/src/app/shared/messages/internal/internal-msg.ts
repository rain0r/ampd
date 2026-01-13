import { PageEvent } from "@angular/material/paginator";

export enum InternMsgType {
  /**
   * Transports the keyword to filter when browsing directories.
   */
  BrowseFilter,
}

export enum InternMsgSrc {
  Search,
  AdvSearch,
  PlaylistDialog,
}

export interface InternMsg {
  type: InternMsgType;
}

export interface FilterMsg extends InternMsg {
  filterValue: string;
}

export interface PaginationMsg extends InternMsg {
  event: PageEvent;
  src: InternMsgSrc;
}
