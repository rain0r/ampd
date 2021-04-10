import { Component, Input, OnInit } from "@angular/core";
import { NotificationService } from "../../../shared/services/notification.service";
import { QueueService } from "../../../shared/services/queue.service";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { MatDialogConfig } from "@angular/material/dialog/dialog-config";
import { PlaylistInfoModalComponent } from "../playlist-info-modal/playlist-info-modal.component";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { SettingsService } from "../../../shared/services/settings.service";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-playlist-entry",
  templateUrl: "./playlist-entry.component.html",
  styleUrls: ["./playlist-entry.component.scss"],
})
export class PlaylistEntryComponent implements OnInit {
  @Input() playlist: Playlist | null = null;
  isMobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  onRowClick(playlistName: string): void {
    this.queueService.addPlaylist(playlistName);
    this.notificationService.popUp(`Added playlist: "${playlistName}"`);
  }

  onPlaylistInfo($event: MouseEvent, playlist: Playlist): void {
    $event.stopPropagation();
    const width = this.isMobile ? "100%" : "70%";
    const options: MatDialogConfig = {
      maxWidth: "100vw",
      panelClass: this.settingsService.darkTheme$.value ? "dark-theme" : "",
      width: width,
      data: playlist,
    };
    if (this.isMobile) {
      options["height"] = "100%";
      options["maxHeight"] = "100vh";
    }
    this.dialog.open(PlaylistInfoModalComponent, options);
  }
}
