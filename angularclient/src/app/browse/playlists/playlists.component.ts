import { Component, Input, OnInit } from "@angular/core";
import { Playlist } from "../../shared/messages/incoming/playlist-impl";
import { MessageService } from "../../shared/services/message.service";
import { NotificationService } from "../../shared/services/notification.service";
import { Filterable } from "../filterable";
import { MatDialog } from "@angular/material/dialog";
import { PlaylistInfoModalComponent } from "./playlist-info-modal/playlist-info-modal.component";
import { SettingsService } from "../../shared/services/settings.service";
import { MatDialogConfig } from "@angular/material/dialog/dialog-config";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { QueueService } from "../../shared/services/queue.service";

@Component({
  selector: "app-playlists",
  templateUrl: "./playlists.component.html",
  styleUrls: ["./playlists.component.scss"],
})
export class PlaylistsComponent extends Filterable implements OnInit {
  @Input() playlists: Playlist[] = [];
  isMobile = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private settingsService: SettingsService
  ) {
    super(messageService);
  }

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
      panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
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
