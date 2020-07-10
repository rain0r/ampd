import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { MpdCommands } from "../../../shared/mpd/mpd-commands";
import { WebSocketService } from "../../../shared/services/web-socket.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ActivatedRoute } from "@angular/router";
import { MpdService } from "../../../shared/services/mpd.service";
import { PlaylistInfo } from "../../../shared/models/playlist-info";
import { Observable } from "rxjs";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-playlist-info-modal",
  templateUrl: "./playlist-info-modal.component.html",
  styleUrls: ["./playlist-info-modal.component.scss"],
})
export class PlaylistInfoModalComponent implements OnInit {
  displayedColumns = [];
  playlistInfo: Observable<PlaylistInfo>;

  constructor(
    public dialogRef: MatDialogRef<PlaylistInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Playlist,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private mpdService: MpdService,
    private deviceService: DeviceDetectorService
  ) {
    this.displayedColumns = this.getDisplayedColumns();
  }

  ngOnInit(): void {
    this.playlistInfo = this.mpdService.getPlaylistInfo(this.data.name);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onDeletePlaylist(): void {
    this.webSocketService.sendData(MpdCommands.DELETE_PLAYLIST, {
      playlistName: this.data.name,
    });
    this.dialogRef.close();
    this.notificationService.popUp(`Deleted playlist: "${this.data.name}"`);
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const dir = <string>queryParams.dir || "/";
      this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
        path: dir,
      });
    });
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "pos", showMobile: false },
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
    ];
    const isMobile = this.deviceService.isMobile();
    return displayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
