import { Component, Input } from "@angular/core";
import { Playlist } from "../../shared/messages/incoming/playlist-impl";
import { Observable } from "rxjs";
import { Filterable } from "../filterable";
import { MessageService } from "../../shared/services/message.service";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlists: Playlist[] = [];
  virtualScroll: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private messageService: MessageService
  ) {
    super(messageService);
    this.virtualScroll = this.frontendSettingsService.virtualScroll;
  }
}
