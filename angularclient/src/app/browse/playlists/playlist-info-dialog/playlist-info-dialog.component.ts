import { CdkScrollable } from "@angular/cdk/scrolling";
import { AsyncPipe } from "@angular/common";
import { AfterViewInit, Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, switchMap } from "rxjs";
import { NotificationService } from "../../../service/notification.service";
import { PlaylistService } from "../../../service/playlist.service";
import { QueueService } from "../../../service/queue.service";
import { ResponsiveScreenService } from "../../../service/responsive-screen.service";
import { Playlist } from "../../../shared/messages/incoming/playlist";
import { PlaylistInfo } from "../../../shared/model/playlist-info";
import { ClickActions } from "../../../shared/track-table-data/click-actions.enum";
import { TrackTableDataComponent } from "../../../shared/track-table-data/track-table-data.component";
import { TrackTableOptions } from "../../../shared/track-table-data/track-table-options";

@Component({
  selector: "app-playlist-info-dialog",
  templateUrl: "./playlist-info-dialog.component.html",
  styleUrls: ["./playlist-info-dialog.component.scss"],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatProgressSpinner,
    TrackTableDataComponent,
    MatDialogActions,
    MatButton,
    MatIcon,
    MatDialogClose,
    AsyncPipe,
  ],
})
export class PlaylistInfoDialogComponent implements AfterViewInit {
  dialogRef = inject<MatDialogRef<PlaylistInfoDialogComponent>>(MatDialogRef);
  isLoadingResults = new BehaviorSubject(true);
  playlistInfo: Observable<PlaylistInfo>;
  trackTableData = new TrackTableOptions();
  data = inject<Playlist>(MAT_DIALOG_DATA);

  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  private playlistService = inject(PlaylistService);
  private queueService = inject(QueueService);
  private responsiveScreenService = inject(ResponsiveScreenService);
  private router = inject(Router);

  private isMobile = false;
  private playlistInfo$ = new Subject<PlaylistInfo>();

  constructor() {
    this.playlistInfo = this.playlistInfo$.asObservable();
    this.responsiveScreenService
      .isMobile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngAfterViewInit(): void {
    this.isLoadingResults.next(false);

    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((queryParams) => {
          this.isLoadingResults.next(true);
          return this.playlistService.getPlaylistInfo(
            this.data.name,
            Number(queryParams.get("pageIndex")),
            Number(queryParams.get("pageSize")),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((info) => {
        this.trackTableData = this.buildTable(info);
        this.playlistInfo$.next(info);
        this.isLoadingResults.next(false);
      });
  }

  onDeletePlaylist(): void {
    this.playlistService
      .deletePlaylist(this.data.name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notificationService.popUp(`Deleted playlist: "${this.data.name}"`);
        this.router
          .navigate(["/browse"], { queryParams: { dir: "/" } })
          .catch(() => void 0);
      });
    this.dialogRef.close();
  }

  onAddPlaylist(): void {
    this.queueService.addPlaylist(this.data.name);
    this.notificationService.popUp(`Added playlist: "${this.data.name}"`);
  }

  private buildTable(info: PlaylistInfo): TrackTableOptions {
    const trackTable = new TrackTableOptions({
      displayedColumns: this.getDisplayedColumns(),
      onPlayClick: ClickActions.AddPlayTrack,
      totalElements: info.tracks.totalElements,
      totalPages: info.tracks.totalPages,
      pageIndex: info.tracks.number,
      showPageSizeOptions: false,
    });
    trackTable.addTracks(info.tracks.content);
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
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
