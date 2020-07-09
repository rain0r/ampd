import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { MpdCommands } from "../../../shared/mpd/mpd-commands";
import { WebSocketService } from "../../../shared/services/web-socket.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ActivatedRoute } from "@angular/router";
import { MpdService } from "../../../shared/services/mpd.service";

@Component({
  selector: "app-playlist-info-modal",
  templateUrl: "./playlist-info-modal.component.html",
  styleUrls: ["./playlist-info-modal.component.scss"],
})
export class PlaylistInfoModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PlaylistInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Playlist,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private mpdService: MpdService
  ) {}

  ngOnInit(): void {
    this.mpdService.getPlaylistInfo(this.data.name);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onDeletePlaylist(): void {
    this.webSocketService.sendData(MpdCommands.DELETE_PLAYLIST, {
      playlistName: this.data.name,
    });
    // this.playlistQueue.forEach((item, index) => {
    //   if (item.name === playlistName) {
    //     this.playlistQueue.splice(index, 1);
    //   }
    // });
    this.dialogRef.close();
    this.notificationService.popUp(`Deleted playlist: "${this.data.name}"`);
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const dir = <string>queryParams.dir || "/";
      this.webSocketService.sendData(MpdCommands.GET_BROWSE, {
        path: dir,
      });
    });
  }
}
