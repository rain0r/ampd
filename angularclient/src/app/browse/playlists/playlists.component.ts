import { Component, Input } from "@angular/core";
import { Playlist } from "../../shared/messages/incoming/playlist-impl";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { Filterable } from "../filterable";
import { MatDialog } from "@angular/material/dialog";
import { PlaylistInfoModalComponent } from "./playlist-info-modal/playlist-info-modal.component";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlistQueue: Playlist[] = [];

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    super(messageService);
  }

  onClickPlaylist(playlistName: string): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAYLIST, {
      playlist: playlistName,
    });
    this.notificationService.popUp(`Added playlist: "${playlistName}"`);
  }

  onPlaylistInfo($event: MouseEvent, playlist: Playlist): void {
    $event.stopPropagation();
    this.dialog.open(PlaylistInfoModalComponent, {
      width: "70%",
      data: playlist,
    });
  }
}
