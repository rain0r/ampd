import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";

import { MpdTrack } from "../shared/messages/incoming/mpd-track";
import {
  ISearchMsgPayload,
  ISearchResult,
} from "../shared/messages/incoming/search";
import { QueueTrack } from "../shared/models/queue-track";
import { MpdCommands } from "../shared/mpd/mpd-commands";
import { WebSocketService } from "../shared/services/web-socket.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { NotificationService } from "../shared/services/notification.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  oldDataSource: MatTableDataSource<QueueTrack> = new MatTableDataSource<
    QueueTrack
  >([]);
  searchResultCount = 0;
  search = "";
  spinnerVisible = false;

  private oldDisplayedColumns = [
    { name: "artistName", showMobile: true },
    { name: "albumName", showMobile: false },
    { name: "title", showMobile: true },
    { name: "length", showMobile: false },
    { name: "addTitle", showMobile: true },
    { name: "playTitle", showMobile: true },
  ];

  constructor(
    private ref: ChangeDetectorRef,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private deviceService: DeviceDetectorService
  ) {
    this.getResults();
  }

  ngOnInit() {
    this.oldDataSource.sort = this.sort;
  }

  onPlayTitle(track: MpdTrack): void {
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Playing: ${track.title}`);
  }

  onAddTitle(track: MpdTrack): void {
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Added: ${track.title}`);
  }

  applySearch(searchValue: string): void {
    this.search = searchValue;
    if (searchValue) {
      // Only search when the term is at least 3 chars long
      if (searchValue.length > 3) {
        this.webSocketService.sendData(MpdCommands.SEARCH, {
          query: searchValue,
        });
        this.spinnerVisible = true;
      }
    } else {
      this.resetSearch();
    }
  }

  resetSearch(): void {
    this.oldDataSource.data = [];
    this.searchResultCount = 0;
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.deviceService.isMobile();
    return this.oldDisplayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  /**
   * Listen for results on the websocket channel
   */
  private getResults(): void {
    this.webSocketService
      .getSearchSubscription()
      .subscribe((message: ISearchMsgPayload) =>
        this.processSearchResults(
          message.searchResults,
          message.searchResultCount
        )
      );
  }

  private processSearchResults(
    searchResults: ISearchResult[],
    searchResultCount: number
  ): void {
    this.resetSearch();
    const tableData = [];
    searchResults.forEach((track: ISearchResult) => {
      tableData.push(new QueueTrack(track));
    });

    this.oldDataSource = new MatTableDataSource<QueueTrack>(tableData);
    this.oldDataSource.sort = this.sort;

    this.searchResultCount = searchResultCount;
    this.spinnerVisible = false;
    this.ref.detectChanges();
  }
}
