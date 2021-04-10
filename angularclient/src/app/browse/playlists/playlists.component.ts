import { Component, Input } from "@angular/core";
import { Playlist } from "../../shared/messages/incoming/playlist-impl";
import { SettingsService } from "../../shared/services/settings.service";
import { Observable } from "rxjs";
import { Filterable } from "../filterable";
import { MessageService } from "../../shared/services/message.service";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlists: Playlist[] = [];
  virtualScroll: Observable<boolean>;

  constructor(
    private messageService: MessageService,
    private settingsService: SettingsService
  ) {
    super(messageService);
    this.virtualScroll = this.settingsService.getFrontendSettings().virtualScroll;
  }
}
