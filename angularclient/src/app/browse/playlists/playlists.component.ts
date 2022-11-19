import { Component, Input } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { FrontendSettingsService } from "../../service/frontend-settings.service";
import { MsgService } from "../../service/msg.service";
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
    private messageService: MsgService
  ) {
    super(messageService);
    this.pageSizeOptions = this.frontendSettingsService.pageSizeOptions;
    this.paginationTo = this.frontendSettingsService.paginationTo;
    this.pagination = this.frontendSettingsService.getBoolValue$(
      SettingKeys.PAGINATION
    );
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }
}
