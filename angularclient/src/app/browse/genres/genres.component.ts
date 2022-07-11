import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { delay, distinctUntilChanged, filter, map, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { AmpdBrowsePayload } from "src/app/shared/models/ampd-browse-payload";
import { Track } from "../../shared/messages/incoming/track";
import { GenresPayload } from "../../shared/models/http/genres";
import { QueueTrack } from "../../shared/models/queue-track";
import { GenresService as GenreService } from "../../service/genres.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { ClickActions } from "../../shared/track-table/click-actions.enum";
import { TrackTableData } from "../../shared/track-table/track-table-data";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
})
export class GenresComponent implements OnInit {
  genres = new Observable<string[]>();
  genrePayload = new Observable<GenresPayload>();
  trackTableData = new TrackTableData();
  isMobile = false;
  selectedIndex = 0;
  browsePayload = new Observable<AmpdBrowsePayload>();

  constructor(
    private genreService: GenreService,
    private activatedRoute: ActivatedRoute,
    private responsiveScreenService: ResponsiveScreenService,
    private viewportScroller: ViewportScroller
  ) {
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngOnInit(): void {
    this.genres = this.genreService.listGenres();

    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => <string>qp.get("genre") || ""),
        filter((qp) => qp !== ""),
        distinctUntilChanged()
      )
      .subscribe((genre) => {
        this.genrePayload = this.genreService.listGenre(genre).pipe(
          tap((payload) => {
            this.trackTableData = this.buildTableData(
              this.buildDataSource(payload.tracks)
            );
            if (payload.albums.length === 0 && payload.tracks.length > 0) {
              // Switch to tracks tab, if there are no albums
              this.selectedIndex = 1;
            }
          })
        );

        // Scrolling to anchor needs to be delayed to work
        of(null)
          .pipe(delay(250))
          .subscribe(() => this.viewportScroller.scrollToAnchor("results"));
      });
  }

  private buildDataSource(tracks: Track[]): MatTableDataSource<QueueTrack> {
    const dataSource = new MatTableDataSource<QueueTrack>();
    dataSource.data = tracks.map(
      (track, index) => new QueueTrack(track, index)
    );
    return dataSource;
  }

  private buildTableData(
    dataSource: MatTableDataSource<QueueTrack>
  ): TrackTableData {
    const trackTable = new TrackTableData();
    trackTable.dataSource = dataSource;
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.pagination = true;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "playTitle", showMobile: true },
      { name: "addTitle", showMobile: true },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
