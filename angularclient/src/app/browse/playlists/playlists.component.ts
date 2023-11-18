import { Component, Input } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { FrontendSettingsService } from "../../service/frontend-settings.service";
import { MsgService } from "../../service/msg.service";
import { Playlist } from "../../shared/messages/incoming/playlist";
import { Filterable } from "../filterable";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlists: Playlist[] = [];

  pageSizeOptions: number[];
  paginationFrom = 0;
  paginationTo = 50;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private messageService: MsgService,
  ) {
    super(messageService);
    this.pageSizeOptions = this.frontendSettingsService.pageSizeOptions;
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }
}
