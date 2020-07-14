import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";

import { WebSocketService } from "../../../shared/services/web-socket.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ActivatedRoute } from "@angular/router";
import { MpdService } from "../../../shared/services/mpd.service";
import { PlaylistInfo } from "../../../shared/models/playlist-info";
import { Observable, Subject } from "rxjs";
import { DeviceDetectorService } from "ngx-device-detector";
import { TrackTableData } from "../../../shared/track-table/track-table-data";
import { MpdTrack } from "../../../shared/messages/incoming/mpd-track";
import { QueueTrack } from "../../../shared/models/queue-track";
import { MatTableDataSource } from "@angular/material/table";
import { MpdCommands } from "../../../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-playlist-info-modal",
  templateUrl: "./playlist-info-modal.component.html",
  styleUrls: ["./playlist-info-modal.component.scss"],
})
export class PlaylistInfoModalComponent implements OnInit {
  playlistInfo: Observable<PlaylistInfo>;
  trackTableData = new TrackTableData();
  private playlistInfoSubject = new Subject<PlaylistInfo>();

  constructor(
    public dialogRef: MatDialogRef<PlaylistInfoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Playlist,
    private webSocketService: WebSocketService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private mpdService: MpdService,
    private deviceService: DeviceDetectorService
  ) {
    this.playlistInfo = this.playlistInfoSubject.asObservable();
  }

  ngOnInit(): void {
    this.mpdService.getPlaylistInfo(this.data.name).subscribe((info) => {
      const tableData = new TrackTableData();
      tableData.dataSource = this.buildDataSource(info.tracks);
      tableData.displayedColumns = this.getDisplayedColumns();
      this.trackTableData = tableData;
      this.playlistInfoSubject.next(info);
    });
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

  onAddPlaylist(): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAYLIST, {
      playlist: this.data.name,
    });
    this.notificationService.popUp(`Added playlist: "${this.data.name}"`);
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
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

  private buildDataSource(tracks: MpdTrack[]) {
    const dataSource = new MatTableDataSource<QueueTrack>();
    const tmp: QueueTrack[] = [];
    tracks.forEach((track, index) => {
      track.position = index;
      tmp.push(new QueueTrack(track));
    });
    dataSource.data = tmp;
    return dataSource;
  }
}
