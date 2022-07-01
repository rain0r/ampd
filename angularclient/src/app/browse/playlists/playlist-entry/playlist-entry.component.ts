import { Component, Input } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { ResponsiveScreenService } from "src/app/shared/services/responsive-screen.service";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { FrontendSettingsService } from "../../../shared/services/frontend-settings.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { QueueService } from "../../../shared/services/queue.service";
import { PlaylistInfoModalComponent } from "../playlist-info-modal/playlist-info-modal.component";

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
    private frontendSettingsService: FrontendSettingsService,
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
        panelClass: this.frontendSettingsService.darkTheme$.value
          ? "dark-theme"
          : "",
        width: width,
        data: playlist,
      };
      if (isMobile) {
        options["height"] = "100%";
        options["maxHeight"] = "100vh";
      }
      this.dialog.open(PlaylistInfoModalComponent, options);
    });
  }
}
