import { Component, Input } from "@angular/core";
import { Playlist } from "../../shared/messages/incoming/playlist-impl";
import { Observable } from "rxjs";
import { Filterable } from "../filterable";
import { MessageService } from "../../shared/services/message.service";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlists: Playlist[] = [];
  paginationFrom: number = 0;
  paginationTo: number = 20;
  pagination: Observable<boolean>;
  virtualScroll: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private messageService: MessageService
  ) {
    super(messageService);
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
