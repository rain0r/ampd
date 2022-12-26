import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
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
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private queueService: QueueService
  ) {}

  onRowClick(playlistName: string): void {
    this.queueService.addPlaylist(playlistName);
    this.notificationService.popUp(`Added playlist: "${playlistName}"`);
  }

  onPlaylistInfo($event: MouseEvent, playlist: Playlist): void {
    $event.stopPropagation();
    this.dialog.open(PlaylistInfoDialogComponent, {
      data: playlist,
    });
  }
}
