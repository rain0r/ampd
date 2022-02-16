import { Component, Input } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { Playlist } from "../../shared/messages/incoming/playlist-impl";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";
import { MessageService } from "../../shared/services/message.service";
import { Filterable } from "../filterable";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlists: Playlist[] = [];

  pageSizeOptions: number[];
  pagination: Observable<boolean>;
  paginationFrom = 0;
  paginationTo: number;
  virtualScroll: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private messageService: MessageService
  ) {
    super(messageService);
    this.pageSizeOptions = this.frontendSettingsService.pageSizeOptions;
    this.paginationTo = this.frontendSettingsService.paginationTo;
    this.pagination = this.frontendSettingsService.pagination;
    this.virtualScroll = this.frontendSettingsService.virtualScroll;
  }
  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }
}
