import { Component } from "@angular/core";

import { Observable } from "rxjs";

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

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  search = "";
  searchSubs: Observable<ISearchMsgPayload>;
  titleQueue: QueueTrack[] = [];
  searchResultCount = 0;
  private displayedColumns = [
    { name: "artistName", showMobile: true },
    { name: "albumName", showMobile: false },
    { name: "title", showMobile: true },
    { name: "length", showMobile: false },
    { name: "action", showMobile: true },
  ];

  constructor(
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private deviceService: DeviceDetectorService
  ) {
    this.searchSubs = this.webSocketService.getSearchSubscription();
    this.getResults();
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
      }
    } else {
      this.resetSearch();
    }
  }


  resetSearch(): void {
    this.titleQueue = [];
    this.searchResultCount = 0;
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.deviceService.isMobile();
    return this.displayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  /**
   * Listen for results on the websocket channel
   */
  private getResults(): void {
    this.searchSubs.subscribe((message: ISearchMsgPayload) =>
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
    searchResults.forEach((track: ISearchResult) => {
      this.titleQueue.push(new QueueTrack(track));
    });
    this.searchResultCount = searchResultCount;
  }
}
