import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { bufferTime, filter, map } from "rxjs/operators";
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
export class SearchComponent implements OnInit {
  @ViewChild("searchInput", { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    if (element && !this.isMobile) {
      element.nativeElement.focus();
    }
  }
  dataSource = new MatTableDataSource<QueueTrack>([]);
  isLoading = false;
  isMobile = false;
  search = "";
  searchResultCount = 0;
  trackTableData = new TrackTableData();
  private searchResultTracks: QueueTrack[] = [];
  private inputSetter$ = new Subject<string>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private searchService: SearchService
  ) {
    this.buildMsgReceiver();
    this.buildInputListener();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
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
    this.isLoading = false;
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
    const searchInput = this.inputSetter$.asObservable().pipe(
      bufferTime(1000),
      filter((times: string[]) => times.length > 0),
      map((input: string[]) => input[input.length - 1])
    );
    searchInput.subscribe((searchValue) => {
      // Only search when the term is at least 3 chars long
      if (searchValue.length > 2) {
        this.searchService.search(searchValue);
        this.isLoading = true;
      }
    });
  }
}
