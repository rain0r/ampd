import { Component, Input } from "@angular/core";
import { PlaylistImpl } from "../../shared/messages/incoming/playlist-impl";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { Filterable } from "../filterable";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlistQueue: PlaylistImpl[] = [];

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private messageService: MessageService
  ) {
    super(messageService);
  }

  onClickPlaylist(playlistName: string): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAYLIST, {
      playlist: playlistName,
    });
    this.notificationService.popUp(`Added playlist: "${playlistName}"`);
  }

  onDeletePlaylist(playlistName: string) {
    this.webSocketService.sendData(MpdCommands.DELETE_PLAYLIST, {
      playlist: playlistName,
    });
    this.notificationService.popUp(`Deleted playlist: "${playlistName}"`);
  }
}
