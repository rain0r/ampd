import { AsyncPipe, ViewportScroller } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { delay, Observable, of } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { GenresService as GenreService } from "../../service/genres.service";
import { GenreResponse } from "../../shared/messages/incoming/genres-response";
import { PaginatedResponse } from "../../shared/messages/incoming/paginated-response";
import { Track } from "../../shared/messages/incoming/track";
import { AmpdBrowsePayload } from "../../shared/model/browse-payload";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableDataComponent } from "../../shared/track-table-data/track-table-data.component";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";
import { AlbumItemComponent } from "../albums/album-item/album-item.component";
import { BrowseNavigationComponent } from "../navigation/browse-navigation.component";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private genreService = inject(GenreService);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  browsePayload = new Observable<AmpdBrowsePayload>();
  genrePayload = new Observable<GenreResponse>();
  genres = new Observable<string[]>();
  selectedIndex = 0;
  trackTableData = new TrackTableOptions();

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
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(this.processSearchResults);
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
      .pipe(delay(150), takeUntilDestroyed(this.destroyRef))
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
      onPlayClick: ClickActions.AddPlayTrack,
      totalElements: paginatedTracks.totalElements,
      totalPages: paginatedTracks.totalPages,
      pageIndex: paginatedTracks.number,
    });
    trackTable.addTracks(paginatedTracks.content);
    return trackTable;
  }
}
