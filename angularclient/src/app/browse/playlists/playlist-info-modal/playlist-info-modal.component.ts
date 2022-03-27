import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { NotificationService } from "../../../shared/services/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PlaylistInfo } from "../../../shared/models/playlist-info";
import { Observable, Subject } from "rxjs";
import { TrackTableData } from "../../../shared/track-table/track-table-data";
import { Track } from "../../../shared/messages/incoming/track";
import { QueueTrack } from "../../../shared/models/queue-track";
import { MatTableDataSource } from "@angular/material/table";
import { ErrorMsg } from "../../../shared/error/error-msg";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { QueueService } from "../../../shared/services/queue.service";
import { PlaylistService } from "../../../shared/services/playlist.service";
import { ClickActions } from "../../../shared/track-table/click-actions.enum";

@Component({
  selector: "app-playlist-info-modal",
  templateUrl: "./playlist-info-modal.component.html",
  styleUrls: ["./playlist-info-modal.component.scss"],
})
export class PlaylistInfoModalComponent implements OnInit, AfterViewInit {
  isMobile = false;
  playlistInfo: Observable<PlaylistInfo>;
  trackTableData = new TrackTableData();
  private playlistInfo$ = new Subject<PlaylistInfo>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Playlist,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private playlistService: PlaylistService,
    private queueService: QueueService,
    private router: Router,
    public dialogRef: MatDialogRef<PlaylistInfoModalComponent>
  ) {
    this.playlistInfo = this.playlistInfo$.asObservable();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngAfterViewInit(): void {
    this.playlistService.getPlaylistInfo(this.data.name).subscribe((info) => {
      const tableData = new TrackTableData();
      tableData.addTitleColumn = true;
      tableData.clickable = true;
      tableData.dataSource = this.buildDataSource(info.tracks);
      tableData.displayedColumns = this.getDisplayedColumns();
      tableData.notify = true;
      tableData.onPlayClick = ClickActions.AddPlayTrack;
      tableData.playTitleColumn = true;
      this.trackTableData = tableData;
      this.playlistInfo$.next(info);
    });
  }

  onDeletePlaylist(): void {
    this.playlistService.deletePlaylist(this.data.name).subscribe({
      next : () => {
        this.notificationService.popUp(`Deleted playlist: ${this.data.name}`);
      },
      error:(errorMsg: ErrorMsg) => {
        this.notificationService.popUp(
          `${errorMsg.title}: ${errorMsg.detail}`,
          true
        );
      },
      complete:() =>
        void this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { action: "playlist-deleted" },
          queryParamsHandling: "merge",
        })
      });
    this.dialogRef.close();
  }

  onAddPlaylist(): void {
    this.queueService.addPlaylist(this.data.name);
    this.notificationService.popUp(`Added playlist: "${this.data.name}"`);
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "playTitle", showMobile: false },
      { name: "addTitle", showMobile: false },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  private buildDataSource(tracks: Track[]): MatTableDataSource<QueueTrack> {
    const dataSource = new MatTableDataSource<QueueTrack>();
    dataSource.data = tracks.map(
      (track, index) => new QueueTrack(track, index)
    );
    return dataSource;
  }
}
