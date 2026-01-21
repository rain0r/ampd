import { AsyncPipe, ViewportScroller } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { delay, Observable, of } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { GenreResponse } from "src/app/shared/messages/incoming/genres-response";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import { Track } from "src/app/shared/messages/incoming/track";
import { AmpdBrowsePayload } from "src/app/shared/model/browse-payload";
import { GenresService as GenreService } from "../../service/genres.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableDataComponent } from "../../shared/track-table-data/track-table-data.component";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";
import { AlbumItemComponent } from "../albums/album-item/album-item.component";
import { BrowseNavigationComponent } from "../navigation/browse-navigation.component";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
  imports: [
    BrowseNavigationComponent,
    MatButton,
    RouterLink,
    MatTabGroup,
    MatTab,
    AlbumItemComponent,
    MatPaginator,
    TrackTableDataComponent,
    AsyncPipe,
  ],
})
export class GenresComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private genreService = inject(GenreService);
  private responsiveScreenService = inject(ResponsiveScreenService);
  private viewportScroller = inject(ViewportScroller);
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);

  browsePayload = new Observable<AmpdBrowsePayload>();
  genrePayload = new Observable<GenreResponse>();
  genres = new Observable<string[]>();
  isMobile = false;
  selectedIndex = 0;
  trackTableData = new TrackTableOptions();

  constructor() {
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngOnInit(): void {
    this.genres = this.genreService.listGenres();

    this.activatedRoute.queryParamMap
      .pipe(
        filter((queryParams) => queryParams.has("genre")),
        switchMap((queryParams) => {
          return this.genreService.listGenre(
            queryParams.get("genre") || "",
            Number(queryParams.get("pageIndex")),
            Number(queryParams.get("pageSize")),
          );
        }),
      )
      .subscribe((data) => this.processSearchResults(data));
  }

  handlePage($event: PageEvent): void {
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { pageIndex: $event.pageIndex },
      queryParamsHandling: "merge",
    });
  }

  scrollDown(): void {
    // Scrolling to anchor needs to be delayed to work
    of(null)
      .pipe(delay(150))
      .subscribe(() => this.viewportScroller.scrollToAnchor("results"));
  }

  private processSearchResults(genreResponse: GenreResponse) {
    genreResponse.genre = decodeURIComponent(genreResponse.genre);
    this.trackTableData = this.buildTableData(genreResponse.tracks);
    if (
      genreResponse.albums.content.length === 0 &&
      genreResponse.tracks.content.length > 0
    ) {
      // Switch to tracks tab, if there are no albums
      this.selectedIndex = 1;
    }
    this.genrePayload = of(genreResponse);
    this.changeDetectorRef.detectChanges();
    this.scrollDown();
  }

  private buildTableData(
    paginatedTracks: PaginatedResponse<Track>,
  ): TrackTableOptions {
    const trackTable = new TrackTableOptions({
      displayedColumns: this.getDisplayedColumns(),
      onPlayClick: ClickActions.AddPlayTrack,
      totalElements: paginatedTracks.totalElements,
      totalPages: paginatedTracks.totalPages,
      pageIndex: paginatedTracks.number,
    });
    trackTable.addTracks(paginatedTracks.content);
    return trackTable;
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
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
