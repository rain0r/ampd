import { SlicePipe } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { PAGE_SIZE_OPTIONS } from "src/app/shared/page-size-options";
import { FilterService } from "../../service/msg.service";
import { Playlist } from "../../shared/messages/incoming/playlist";
import { PlaylistFilterPipe } from "../../shared/pipes/filter/playlist-filter.pipe";
import { Filterable } from "../filterable";
import { PlaylistEntryComponent } from "./playlist-entry/playlist-entry.component";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
  imports: [
    PlaylistEntryComponent,
    MatPaginator,
    SlicePipe,
    PlaylistFilterPipe,
  ],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlists: Playlist[] = [];

  pageSizeOptions = PAGE_SIZE_OPTIONS;
  paginationFrom = 0;
  paginationTo = 50;

  constructor() {
    const filterService = inject(FilterService);
    super(filterService);
  }

  public handlePage(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }
}
