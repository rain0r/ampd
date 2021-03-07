import {Component, Input} from "@angular/core";
import {Playlist} from "../../shared/messages/incoming/playlist-impl";
import {MessageService} from "../../shared/services/message.service";
import {NotificationService} from "../../shared/services/notification.service";
import {WebSocketService} from "../../shared/services/web-socket.service";
import {Filterable} from "../filterable";
import {MatDialog} from "@angular/material/dialog";
import {PlaylistInfoModalComponent} from "./playlist-info-modal/playlist-info-modal.component";
import {MpdCommands} from "../../shared/mpd/mpd-commands.enum";
import {SettingsService} from "../../shared/services/settings.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {MatDialogConfig} from "@angular/material/dialog/dialog-config";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable {
  @Input() playlistQueue: Playlist[] = [];

  constructor(
      private deviceService: DeviceDetectorService,
      private dialog: MatDialog,
      private messageService: MessageService,
      private notificationService: NotificationService,
      private settingsService: SettingsService,
      private webSocketService: WebSocketService
  ) {
    super(messageService);
  }

  onRowClick(playlistName: string): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAYLIST, {
      playlist: playlistName,
    });
    this.notificationService.popUp(`Added playlist: "${playlistName}"`);
  }

  onPlaylistInfo($event: MouseEvent, playlist: Playlist): void {
    $event.stopPropagation();
    const width =
        this.deviceService.isMobile()
            ? "100%"
            : "70%";

    const options: MatDialogConfig = {
      maxWidth: '100vw',
      panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
      width: width,
      data: playlist,
    }

    if (this.deviceService.isMobile()) {
      options["height"] = "100%";
      options["maxHeight"] = "100vh";
    }

    this.dialog.open(PlaylistInfoModalComponent, options);
  }
}
