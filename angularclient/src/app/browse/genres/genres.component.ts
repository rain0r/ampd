import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { delay, distinctUntilChanged, filter, map, Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { AmpdBrowsePayload } from "src/app/shared/model/ampd-browse-payload";
import { GenresService as GenreService } from "../../service/genres.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { Track } from "../../shared/messages/incoming/track";
import { GenresPayload } from "../../shared/model/http/genres";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
})
export class GenresComponent implements OnInit {
  genres = new Observable<string[]>();
  genrePayload = new Observable<GenresPayload>();
  trackTableData = new TrackTableOptions();
  isMobile = false;
  selectedIndex = 0;
  browsePayload = new Observable<AmpdBrowsePayload>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private genreService: GenreService,
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
            this.trackTableData = this.buildTableData(payload.tracks);
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

  private buildTableData(tracks: Track[]): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.addTracks(tracks);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.pagination = true;
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "artist-name", showMobile: true },
      { name: "album-name", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "play-title", showMobile: true },
      { name: "add-title", showMobile: true },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
