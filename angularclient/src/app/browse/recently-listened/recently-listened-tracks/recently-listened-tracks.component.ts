import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";
import { RecentlyListenedService } from "src/app/service/recently-listened.service";
import { Track } from "src/app/shared/messages/incoming/track";
import { QueueTrack } from "src/app/shared/model/queue-track";
import { ClickActions } from "src/app/shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "src/app/shared/track-table-data/track-table-options";

@Component({
  selector: "app-recently-listened-tracks",
  templateUrl: "./recently-listened-tracks.component.html",
  styleUrl: "./recently-listened-tracks.component.css",
})
export class RecentlyListenedTracksComponent implements OnInit {
  tracks$: Observable<Track[]>;
  trackTableData = new TrackTableOptions();

  constructor(private recentlyListenedService: RecentlyListenedService) {
    this.tracks$ = this.recentlyListenedService.getTracks();
  }

  ngOnInit(): void {
    this.trackTableData = this.buildTableData();
  }

  private buildTableData(): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.dataSource = new MatTableDataSource<QueueTrack>(this.tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.pageIndex = 0;
    trackTable.pageSize = this.tracks.length;
    trackTable.totalElements = this.tracks.length;
    trackTable.totalPages = 1;
    trackTable.showPageSizeOptions = false;
    return trackTable;
  }
}
