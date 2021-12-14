import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { Observable } from "rxjs";
import { TrackTableData } from "../../shared/track-table/track-table-data";
import { MatTableDataSource } from "@angular/material/table";
import { ClickActions } from "../../shared/track-table/click-actions.enum";
import { SettingsService } from "../../shared/services/settings.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { distinctUntilChanged, map } from "rxjs/operators";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"],
})
export class TracksComponent implements OnInit {
  @Input() tracks: QueueTrack[] = [];
  coverSizeClass: Observable<string>;
  dirQp = "/";
  isMobile = false;
  queueDuration = 0;
  trackTableData = new TrackTableData();
  validCoverUrl = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private mpdService: MpdService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private settingsService: SettingsService
  ) {
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => <string>qp.get("dir") || "/"),
        distinctUntilChanged()
      )
      .subscribe((dir) => (this.dirQp = decodeURIComponent(dir)));
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));

    this.trackTableData = this.buildTableData();
    this.queueDuration = this.sumTrackDuration();
  }

  openCoverModal(): void {
    const track = this.tracks[0];
    track.coverUrl = this.mpdService.buildCoverUrl(track.file);
  }

  coverUrl(): string {
    // Add a query param to trigger an image change in the browser
    return `${this.settingsService.getFindDirCoverUrl()}?path=${encodeURIComponent(
      this.dirQp
    )}`;
  }

  onError(): void {
    this.validCoverUrl = false;
  }

  onLoad(): void {
    this.validCoverUrl = true;
  }

  private buildTableData(): TrackTableData {
    const trackTable = new TrackTableData();
    trackTable.addTitleColumn = true;
    trackTable.clickable = true;
    trackTable.dataSource = new MatTableDataSource<QueueTrack>(this.tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.notify = true;
    trackTable.playTitleColumn = true;
    return trackTable;
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
