import { Component, Input } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { map, Observable } from "rxjs";
import { FrontendSettingsService } from "../../service/frontend-settings.service";
import { MessageService } from "../../service/message.service";
import { Playlist } from "../../shared/messages/incoming/playlist-impl";
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

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private messageService: MessageService
  ) {
    super(messageService);
    this.pageSizeOptions = this.frontendSettingsService.pageSizeOptions;
    this.paginationTo = this.frontendSettingsService.paginationTo;
    this.pagination = this.frontendSettingsService.settings$.pipe(
      map((settings) => settings.pagination)
    );
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }
}
