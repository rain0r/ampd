import { Component } from "@angular/core";
import {
  SearchMsgPayload,
  SearchResult,
} from "../shared/messages/incoming/search";
import { QueueTrack } from "../shared/models/queue-track";
import { WebSocketService } from "../shared/services/web-socket.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { MatTableDataSource } from "@angular/material/table";
import { TrackTableData } from "../shared/track-table/track-table-data";
import { MpdCommands } from "../shared/mpd/mpd-commands.enum";
import { ClickActions } from "../shared/track-table/click-actions.enum";
import { NotificationService } from "../shared/services/notification.service";
import { Subject } from "rxjs";
import { bufferTime, filter, map } from "rxjs/operators";
import { MpdService } from "../shared/services/mpd.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  dataSource = new MatTableDataSource<QueueTrack>([]);
  searchResultCount = 0;
  search = "";
  isLoading = false;
  trackTableData = new TrackTableData();
  private searchResultTracks: QueueTrack[] = [];
  private inputSetter$ = new Subject<string>();

  constructor(
    private deviceService: DeviceDetectorService,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService
  ) {
    this.buildMsgReceiver();
    this.buildInputListener();
  }

  applySearch(eventTarget: EventTarget | null): void {
    const inputValue = (<HTMLInputElement>eventTarget).value;
    if (inputValue) {
      this.inputSetter$.next(inputValue);
    }
  }

  resetSearch(): void {
    this.dataSource.data = [];
    this.searchResultCount = 0;
  }

  onAddAll(): void {
    const filePaths: string[] = [];
    this.searchResultTracks.forEach((file: QueueTrack) => {
      filePaths.push(file.file);
    });
    this.webSocketService.sendData(MpdCommands.ADD_TRACKS, {
      tracks: filePaths,
    });
  }

  onClearQueue(): void {
    this.mpdService.clearQueue();
    this.notificationService.popUp("Cleared queue");
  }

  /**
   * Listen for results on the websocket channel
   */
  private buildMsgReceiver(): void {
    this.webSocketService
      .getSearchSubscription()
      .subscribe((message: SearchMsgPayload) =>
        this.processSearchResults(
          message.searchResults,
          message.searchResultCount
        )
      );
  }

  private processSearchResults(
    searchResults: SearchResult[],
    searchResultCount: number
  ): void {
    this.resetSearch();
    this.searchResultTracks = [];
    searchResults.forEach((track: SearchResult) =>
      this.searchResultTracks.push(new QueueTrack(track))
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
    const isMobile = this.deviceService.isMobile();
    const displayedColumns = [
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "addTitle", showMobile: true },
      { name: "playTitle", showMobile: true },
    ];
    return displayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  /**
   * Listens to the input field and buffers the keys. So that we don't send a request per character.
   */
  private buildInputListener(): void {
    const volInput = this.inputSetter$.asObservable().pipe(
      bufferTime(1000),
      filter((times: string[]) => times.length > 0),
      map((input: string[]) => input[input.length - 1])
    );
    volInput.subscribe((searchValue) => {
      // Only search when the term is at least 3 chars long
      if (searchValue.length > 2) {
        this.webSocketService.sendData(MpdCommands.SEARCH, {
          query: searchValue,
        });
        this.isLoading = true;
      }
    });
  }
}
