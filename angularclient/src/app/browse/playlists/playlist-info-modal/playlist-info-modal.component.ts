import { AfterViewInit, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { ErrorMsg } from "../../../shared/error/error-msg";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { Track } from "../../../shared/messages/incoming/track";
import { PlaylistInfo } from "../../../shared/models/playlist-info";
import { QueueTrack } from "../../../shared/models/queue-track";
import { NotificationService } from "../../../service/notification.service";
import { PlaylistService } from "../../../service/playlist.service";
import { QueueService } from "../../../service/queue.service";
import { ClickActions } from "../../../shared/track-table/click-actions.enum";
import { TrackTableData } from "../../../shared/track-table/track-table-data";

@Component({
  selector: "app-playlist-info-modal",
  templateUrl: "./playlist-info-modal.component.html",
  styleUrls: ["./playlist-info-modal.component.scss"],
})
export class PlaylistInfoModalComponent implements AfterViewInit {
  playlistInfo: Observable<PlaylistInfo>;
  trackTableData = new TrackTableData();
  private playlistInfo$ = new Subject<PlaylistInfo>();
  private isMobile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Playlist,
    public dialogRef: MatDialogRef<PlaylistInfoModalComponent>,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private playlistService: PlaylistService,
    private router: Router,
    private responsiveScreenService: ResponsiveScreenService,
    private queueService: QueueService
  ) {
    this.playlistInfo = this.playlistInfo$.asObservable();
    this.responsiveScreenService
      .isMobile()
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
      next: () => {
        this.notificationService.popUp(`Deleted playlist: ${this.data.name}`);
      },
      error: (errorMsg: ErrorMsg) => {
        this.notificationService.popUp(
          `${errorMsg.title}: ${errorMsg.detail}`,
          true
        );
      },
      complete: () =>
        void this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { action: "playlist-deleted" },
          queryParamsHandling: "merge",
        }),
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
