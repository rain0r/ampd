import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { of, Subject } from "rxjs";
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
  dataSource = new MatTableDataSource<QueueTrack>([]);
  isMobile = false;
  search = "";
  searchResultCount = 0;
  trackTableData = new TrackTableOptions();
  private searchResultTracks: QueueTrack[] = [];
  private inputSetter$ = new Subject<string>();

  constructor(
    private notificationService: NotificationService,
    private responsiveScreenService: ResponsiveScreenService,
    private queueService: QueueService,
    private searchService: SearchService,
    private router: Router
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

  onAdvSearchClick(): void {
    this.router
      .navigate(["/adv-search"])
      .then(() => {
        window.location.reload();
      })
      .catch(() => void 0);
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

  private buildTableData(): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.dataSource = this.dataSource;
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
