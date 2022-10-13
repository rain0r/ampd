import { Component, Input, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { LIGHTBOX_SETTINGS } from "src/app/shared/lightbox";
import { MpdService } from "../../service/mpd.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { SettingsService } from "../../service/settings.service";
import { QueueTrack } from "../../shared/model/queue-track";
import { ClickActions } from "../../shared/track-table/click-actions.enum";
import { TrackTableData } from "../../shared/track-table/track-table-data";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"],
})
export class TracksComponent implements OnInit {
  @Input() tracks: QueueTrack[] = [];
  coverSizeClass: Observable<string>;
  dirQp = "/";
  queueDuration = 0;
  lightboxSettings = LIGHTBOX_SETTINGS;
  trackTableData = new TrackTableData();
  validCoverUrl = false;
  private isMobile = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private mpdService: MpdService,
    private responsiveScreenService: ResponsiveScreenService,
    private settingsService: SettingsService
  ) {
    this.coverSizeClass = this.responsiveScreenService.getCoverCssClass();
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => <string>qp.get("dir") || "/"),
        distinctUntilChanged()
      )
      .subscribe((dir) => (this.dirQp = decodeURIComponent(dir)));
  }

  ngOnInit(): void {
    this.trackTableData = this.buildTableData();
    this.queueDuration = this.sumTrackDuration();
  }

  openCoverDialog(): void {
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
    trackTable.dataSource = new MatTableDataSource<QueueTrack>(this.tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
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
