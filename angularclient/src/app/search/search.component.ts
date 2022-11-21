import { Component } from "@angular/core";
import { BehaviorSubject, of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { NotificationService } from "../service/notification.service";
import { QueueService } from "../service/queue.service";
import { SearchService } from "../service/search.service";
import { SearchResponse } from "../shared/messages/incoming/search-response";
import { Track } from "../shared/messages/incoming/track";
import { QueueTrack } from "../shared/model/queue-track";
import { ClickActions } from "../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../shared/track-table-data/track-table-options";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  isLoading = new BehaviorSubject(false);
  isMobile = false;
  search = "";
  searchResultCount = 0;
  trackTableData = new TrackTableOptions();
  private searchResultTracks: QueueTrack[] = [];
  private inputSetter$ = new Subject<string>();

  constructor(
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService,
    private searchService: SearchService
  ) {
    this.buildMsgReceiver();
    this.buildInputListener();
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
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
    this.searchResultCount = 0;
  }

  onAddAll(): void {
    const filePaths: string[] = [];
    this.searchResultTracks.forEach((file: QueueTrack) => {
      filePaths.push(file.file);
    });
    this.queueService.addTracks(filePaths);
  }

  onClearQueue(): void {
    this.queueService.clearQueue();
    this.notificationService.popUp("Cleared queue");
  }

  /**
   * Listen for results on the websocket channel
   */
  private buildMsgReceiver(): void {
    this.searchService
      .getSearchSubscription()
      .subscribe((message: SearchResponse) => {
        this.processSearchResults(
          message.searchResults,
          message.searchResultCount
        );
      });
  }

  private processSearchResults(
    searchResults: Track[],
    searchResultCount: number
  ): void {
    this.trackTableData = this.buildTableData(searchResults);
    this.searchResultCount = searchResultCount;
    this.isLoading.next(false);
  }

  private buildTableData(searchResults: Track[]): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.addTracks(searchResults);
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.totalElements = this.searchResultCount;
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
    this.inputSetter$
      .asObservable()
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((searchText) => {
          this.isLoading.next(true);
          return of(this.searchService.search(searchText));
        })
      )
      .subscribe(() => void 0);
  }
}
