import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, Observable, Subject, combineLatest, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { MsgService } from "../service/msg.service";
import { NotificationService } from "../service/notification.service";
import { QueueService } from "../service/queue.service";
import { SearchService } from "../service/search.service";
import { PaginatedResponse } from "../shared/messages/incoming/paginated-response";
import { Track } from "../shared/messages/incoming/track";
import {
  InternMsgType,
  PaginationMsg,
} from "../shared/messages/internal/internal-msg";
import { QueueTrack } from "../shared/model/queue-track";
import { ClickActions } from "../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../shared/track-table-data/track-table-options";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  advSearchResponse$ = new Observable<PaginatedResponse<Track>>();
  isLoadingResults = new BehaviorSubject(true);
  isMobile = false;
  search = "";

  trackTableData = new TrackTableOptions();
  private inputSetter$ = new Subject<string>();

  constructor(
    private msgService: MsgService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService,
    private searchService: SearchService
  ) {
    this.buildInputListener();
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngOnInit(): void {
    this.isLoadingResults.next(false);
  }

  applySearch(eventTarget: EventTarget | null): void {
    const inputValue = (<HTMLInputElement>eventTarget).value;
    if (inputValue) {
      this.inputSetter$.next(inputValue);
    } else {
      this.resetSearch();
    }
  }

  resetSearch(): void {
    this.trackTableData.dataSource.data = [];
  }

  onAddAll(): void {
    this.queueService.addTracks(
      this.trackTableData.dataSource.data.map((qt: QueueTrack) => qt.file)
    );
  }

  onClearQueue(): void {
    this.queueService.clearQueue();
    this.notificationService.popUp("Cleared queue");
  }

  private buildTableData(
    advSearchResponse: PaginatedResponse<Track>
  ): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.addTracks(advSearchResponse.content);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.totalElements = advSearchResponse.totalElements;
    trackTable.totalPages = advSearchResponse.totalPages;
    trackTable.pageIndex = advSearchResponse.number;
    trackTable.pageSize = advSearchResponse.numberOfElements;
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

  /**
   * Listens to the input field and buffers the keys. So that we don't send a request per character.
   */
  private buildInputListener(): void {
    combineLatest([
      this.inputSetter$.asObservable(),
      this.msgService.message.pipe(
        filter((msg) => msg.type === InternMsgType.PaginationEvent),
        map((msg) => <PaginationMsg>msg),
        map((msg) => msg.event),
        startWith({ pageIndex: null, pageSize: null })
      ),
    ])
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        switchMap(([searchText, pagination]) => {
          this.isLoadingResults.next(true);
          return this.searchService.search(
            searchText,
            pagination.pageIndex,
            pagination.pageSize
          );
        })
      )
      .subscribe((data) => this.processSearchResults(data));
  }

  private processSearchResults(
    advSearchResponse: PaginatedResponse<Track>
  ): void {
    this.trackTableData = this.buildTableData(advSearchResponse);
    this.isLoadingResults.next(false);
    this.advSearchResponse$ = of(advSearchResponse);
  }
}
