import { Component, Input, inject } from "@angular/core";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { FrontendSettingsService } from "../../service/frontend-settings.service";
import { MsgService } from "../../service/msg.service";
import { Playlist } from "../../shared/messages/incoming/playlist";
import { Filterable } from "../filterable";
import { SlicePipe } from "@angular/common";
import { PlaylistEntryComponent } from "./playlist-entry/playlist-entry.component";
import { PlaylistFilterPipe } from "../../shared/pipes/filter/playlist-filter.pipe";

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
  private frontendSettingsService = inject(FrontendSettingsService);
  private messageService: MsgService;

  @Input() playlists: Playlist[] = [];

  pageSizeOptions: number[];
  paginationFrom = 0;
  paginationTo = 50;

  constructor() {
    const messageService = inject(MsgService);

    super(messageService);
    this.messageService = messageService;

    this.pageSizeOptions = this.frontendSettingsService.pageSizeOptions;
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }
}
