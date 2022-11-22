import { ViewportScroller } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import {
  BehaviorSubject,
  combineLatest,
  delay,
  filter,
  map,
  Observable,
  of,
  Subscription,
} from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { MsgService } from "src/app/service/msg.service";
import { GenreResponse } from "src/app/shared/messages/incoming/genres-response";
import { Track } from "src/app/shared/messages/incoming/track";
import {
  InternMsgType,
  PaginationMsg,
} from "src/app/shared/messages/internal/internal-msg";
import { AmpdBrowsePayload } from "src/app/shared/model/ampd-browse-payload";
import { GenresService as GenreService } from "../../service/genres.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";
import { PaginatedResponse } from "./../../shared/messages/incoming/genres-response";

@Component({
  selector: "app-genres",
  templateUrl: "./genres.component.html",
  styleUrls: ["./genres.component.scss"],
})
export class GenresComponent implements OnInit, OnDestroy {
  browsePayload = new Observable<AmpdBrowsePayload>();
  genrePayload = new Observable<GenreResponse>();
  genres = new Observable<string[]>();
  isLoadingResults = new BehaviorSubject(true);
  isMobile = false;
  selectedIndex = 0;
  sub = new Subscription();
  trackTableData = new TrackTableOptions();

  constructor(
    private activatedRoute: ActivatedRoute,
    private genreService: GenreService,
    private msgService: MsgService,
    private responsiveScreenService: ResponsiveScreenService,
    private viewportScroller: ViewportScroller
  ) {
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoadingResults.next(false);
    this.genres = this.genreService.listGenres();
    this.sub = combineLatest([
      this.activatedRoute.queryParamMap.pipe(filter((qp) => qp.has("genre"))),
      this.msgService.message.pipe(
        filter((msg) => msg.type === InternMsgType.PaginationEvent),
        map((msg) => <PaginationMsg>msg),
        map((msg) => msg.event),
        startWith({ pageIndex: null, pageSize: null })
      ),
    ])
      .pipe(
        switchMap(([qp, pagination]) => {
          this.isLoadingResults.next(true);
          return this.genreService.listGenre(
            qp.get("genre") || "",
            pagination.pageIndex,
            pagination.pageSize
          );
        })
      )
      .subscribe((data) => this.processSearchResults(data));
  }

  onAlbumPageChange($event: PageEvent): void {
    this.msgService.sendMessage({
      type: InternMsgType.PaginationEvent,
      event: $event,
    } as PaginationMsg);
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
    this.isLoadingResults.next(false);
    this.scrollDown();
  }

  private buildTableData(
    paginatedTracks: PaginatedResponse<Track>
  ): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.addTracks(paginatedTracks.content);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.totalElements = paginatedTracks.totalElements;
    trackTable.totalPages = paginatedTracks.totalPages;
    trackTable.pageIndex = paginatedTracks.number;
    trackTable.pageSize = paginatedTracks.numberOfElements;
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
