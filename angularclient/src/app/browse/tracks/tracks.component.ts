import { NgPlural, NgPluralCase } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDivider } from "@angular/material/divider";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { distinctUntilChanged, map } from "rxjs/operators";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { SettingsService } from "../../service/settings.service";
import { AlbumCoverDialogComponent } from "../../shared/album-cover-dialog/album-cover-dialog.component";
import { QueueTrack } from "../../shared/model/queue-track";
import { SecondsToHhMmSsPipe } from "../../shared/pipes/seconds-to-hh-mm-ss.pipe";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableDataComponent } from "../../shared/track-table-data/track-table-data.component";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"],
  imports: [
    TrackTableDataComponent,
    MatDivider,
    NgPlural,
    NgPluralCase,
    SecondsToHhMmSsPipe,
  ],
})
export class TracksComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private responsiveScreenService = inject(ResponsiveScreenService);
  private settingsService = inject(SettingsService);

  @Input() tracks: QueueTrack[] = [];
  coverUrl = "";
  dirQp = "/";
  queueDuration = 0;
  trackTableData = new TrackTableOptions();
  validCoverUrl = false;
  private isMobile = false;

  constructor() {
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => (qp.get("dir") as string) || "/"),
        distinctUntilChanged(),
      )
      .subscribe((dir) => (this.dirQp = decodeURIComponent(dir)));
  }

  ngOnInit(): void {
    this.trackTableData = this.buildTableData();
    this.queueDuration = this.sumTrackDuration();
    this.coverUrl = `${this.settingsService.getFindDirCoverUrl()}?path=${encodeURIComponent(
      this.dirQp,
    )}`;
  }

  openCoverDialog(coverUrl: string): void {
    this.dialog.open(AlbumCoverDialogComponent, {
      data: coverUrl,
    });
  }

  onError(): void {
    this.validCoverUrl = false;
  }

  onLoad(): void {
    this.validCoverUrl = true;
  }

  private buildTableData(): TrackTableOptions {
    const trackTable = new TrackTableOptions({
      dataSource: new MatTableDataSource<QueueTrack>(this.tracks),
      displayedColumns: this.getDisplayedColumns(),
      onPlayClick: ClickActions.AddPlayTrack,
      totalElements: this.tracks.length,
      totalPages: 1,
      showPageSizeOptions: false,
    });
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "play-title", showMobile: false },
      { name: "add-title", showMobile: false },
      { name: "info", showMobile: false },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  /**
   * Calculate the sum of all track durations.
   */
  private sumTrackDuration(): number {
    let ret = 0.0;
    for (const item of this.trackTableData.dataSource.data) {
      ret += item.length;
    }
    return ret;
  }
}
