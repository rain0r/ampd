import { delay, of } from "rxjs";
import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ControlPanelService } from "src/app/service/control-panel.service";
import { NotificationService } from "../../../service/notification.service";
import { QueueService } from "../../../service/queue.service";
import { Playlist } from "../../../shared/messages/incoming/playlist";
import { PlaylistInfoDialogComponent } from "../playlist-info-dialog/playlist-info-dialog.component";

@Component({
  selector: "app-playlist-entry",
  templateUrl: "./playlist-entry.component.html",
  styleUrls: ["./playlist-entry.component.scss"],
})
export class PlaylistEntryComponent {
  @Input() playlist: Playlist = <Playlist>{};

  constructor(
    private controlPanelService: ControlPanelService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private queueService: QueueService,
  ) {}

  onPlaylistInfo($event: MouseEvent, playlist: Playlist): void {
    $event.stopPropagation();
    this.dialog.open(PlaylistInfoDialogComponent, {
      data: playlist,
    });
  }

  onPlayDir($event: MouseEvent, playlistName: string): void {
    $event.stopPropagation();
    this.queueService.addPlaylist(playlistName);
    of(null)
      .pipe(delay(500))
      .subscribe(
        // Delay hitting "play" since the tracks might not yet been to the queue
        () => this.controlPanelService.play(),
      );
    this.notificationService.popUp(`Playing playlist: "${playlistName}"`);
  }

  onAddDir($event: MouseEvent, playlistName: string): void {
    $event.stopPropagation();
    this.queueService.addPlaylist(playlistName);
    this.notificationService.popUp(`Playing playlist: "${playlistName}"`);
  }
}
