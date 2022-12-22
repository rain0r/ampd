import { Component, Input } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
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
  @Input() playlist: Playlist | null = null;
  private isMobile = new Observable<boolean>();

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private responsiveScreenService: ResponsiveScreenService,
    private queueService: QueueService
  ) {
    this.isMobile = this.responsiveScreenService.isMobile();
  }

  onRowClick(playlistName: string): void {
    this.queueService.addPlaylist(playlistName);
    this.notificationService.popUp(`Added playlist: "${playlistName}"`);
  }

  onPlaylistInfo($event: MouseEvent, playlist: Playlist): void {
    $event.stopPropagation();

    this.isMobile.subscribe((isMobile) => {
      const width = isMobile ? "100%" : "70%";
      const options: MatDialogConfig = {
        maxWidth: "100vw",
        width: width,
        data: playlist,
      };
      if (isMobile) {
        options["height"] = "100%";
        options["maxHeight"] = "100vh";
      }
      this.dialog.open(PlaylistInfoDialogComponent, options);
    });
  }
}
