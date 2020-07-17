import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConnConfUtil } from "../../shared/conn-conf/conn-conf-util";
import { MpdTrack } from "../../shared/messages/incoming/mpd-track";
import { MessageService } from "../../shared/services/message.service";
import { Filterable } from "../filterable";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { Observable } from "rxjs";
import { TrackTableData } from "../../shared/track-table/track-table-data";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.scss"],
})
export class TracksComponent extends Filterable implements OnInit {
  @Input() tracks: MpdTrack[] = [];
  coverSizeClass: Observable<string>;
  getParamDir = "";
  trackTableData = new TrackTableData();
  validCoverUrl = false;
  queueDuration = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private responsiveCoverSizeService: ResponsiveCoverSizeService
  ) {
    super(messageService);
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.getParamDir =
      this.activatedRoute.snapshot.queryParamMap.get("dir") || "/";
  }

  ngOnInit(): void {
    this.trackTableData = this.buildTableData();
    this.queueDuration = this.sumTrackDuration();
  }

  coverUrl(): string {
    // Add a query param to trigger an image change in the browser
    return `${ConnConfUtil.getFindDirCoverUrl()}?path=${encodeURIComponent(
      this.getParamDir
    )}`;
  }

  onError(): void {
    this.validCoverUrl = false;
  }

  onLoad(): void {
    this.validCoverUrl = true;
  }

  private buildTableData() {
    const trackTable = new TrackTableData();
    trackTable.addTitleColumn = true;
    trackTable.clickable = true;
    trackTable.dataSource = new MatTableDataSource<MpdTrack>(this.tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.notify = true;
    trackTable.playTitleColumn = true;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    return [
      "position",
      "artistName",
      "albumName",
      "title",
      "length",
      "addTitle",
      "playTitle",
    ];
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
