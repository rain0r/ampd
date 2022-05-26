import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { of, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { ResponsiveScreenService } from "src/app/shared/services/responsive-screen.service";
import { SearchResponse } from "../shared/messages/incoming/search-response";
import { Track } from "../shared/messages/incoming/track";
import { QueueTrack } from "../shared/models/queue-track";
import { NotificationService } from "../shared/services/notification.service";
import { QueueService } from "../shared/services/queue.service";
import { SearchService } from "../shared/services/search.service";
import { ClickActions } from "../shared/track-table/click-actions.enum";
import { TrackTableData } from "../shared/track-table/track-table-data";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  @ViewChild("searchInput", { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    if (element && !this.isMobile) {
      element.nativeElement.focus();
    }
  }
  dataSource = new MatTableDataSource<QueueTrack>([]);
  isMobile = false;
  search = "";
  searchResultCount = 0;
  trackTableData = new TrackTableData();
  private searchResultTracks: QueueTrack[] = [];
  private inputSetter$ = new Subject<string>();

  constructor(
    private notificationService: NotificationService,
    private responsiveScreenService: ResponsiveScreenService,
    private queueService: QueueService,
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
    this.dataSource = new MatTableDataSource<QueueTrack>([]);
    this.trackTableData = this.buildTableData();
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
      .subscribe((message: SearchResponse) =>
        this.processSearchResults(
          message.searchResults,
          message.searchResultCount
        )
      );
  }

  private processSearchResults(
    searchResults: Track[],
    searchResultCount: number
  ): void {
    this.searchResultTracks = searchResults.map(
      (track, index) => new QueueTrack(track, index)
    );
    this.dataSource = new MatTableDataSource<QueueTrack>(
      this.searchResultTracks
    );
    this.trackTableData = this.buildTableData();
    this.searchResultCount = searchResultCount;
  }

  private buildTableData(): TrackTableData {
    const trackTable = new TrackTableData();
    trackTable.addTitleColumn = true;
    trackTable.clickable = true;
    trackTable.dataSource = this.dataSource;
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onPlayClick = ClickActions.AddPlayTrack;
    trackTable.notify = true;
    trackTable.pagination = true;
    trackTable.playTitleColumn = true;
    trackTable.sortable = true;
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
          return of(this.searchService.search(searchText));
        })
      )
      .subscribe(() => void 0);
  }
}
