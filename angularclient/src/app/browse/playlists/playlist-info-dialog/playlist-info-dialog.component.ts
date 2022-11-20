import { AfterViewInit, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { NotificationService } from "../../../service/notification.service";
import { PlaylistService } from "../../../service/playlist.service";
import { QueueService } from "../../../service/queue.service";
import { Playlist } from "../../../shared/messages/incoming/playlist-impl";
import { PlaylistInfo } from "../../../shared/model/playlist-info";
import { ClickActions } from "../../../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../../../shared/track-table-data/track-table-options";

@Component({
  selector: "app-playlist-info-dialog",
  templateUrl: "./playlist-info-dialog.component.html",
  styleUrls: ["./playlist-info-dialog.component.scss"],
})
export class PlaylistInfoDialogComponent implements AfterViewInit {
  playlistInfo: Observable<PlaylistInfo>;
  trackTableData = new TrackTableOptions();
  private playlistInfo$ = new Subject<PlaylistInfo>();
  private isMobile = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Playlist,
    public dialogRef: MatDialogRef<PlaylistInfoDialogComponent>,
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
      const tableData = new TrackTableOptions();
      tableData.addTracks(info.tracks);
      tableData.displayedColumns = this.getDisplayedColumns();
      tableData.onPlayClick = ClickActions.AddPlayTrack;
      this.trackTableData = tableData;
      this.playlistInfo$.next(info);
    });
  }

  onDeletePlaylist(): void {
    this.playlistService.deletePlaylist(this.data.name).subscribe({
      next: () => {
        this.notificationService.popUp(`Deleted playlist: ${this.data.name}`);
      },
      error: () => void 0,
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
      { name: "artist-name", showMobile: true },
      { name: "album-name", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "play-title", showMobile: false },
      { name: "add-title", showMobile: false },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
