import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Observable } from "rxjs";

import { IMpdTrack } from "../shared/messages/incoming/mpd-track";
import { SearchRootImpl } from "../shared/messages/incoming/search";
import { QueueTrack } from "../shared/models/queue-track";
import { MpdCommands } from "../shared/mpd/mpd-commands";
import { WebSocketService } from "../shared/services/web-socket.service";
import { AppComponent } from "../app.component";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent {
  search = "";
  searchSubs: Observable<SearchRootImpl>;
  titleQueue: IMpdTrack[] = [];
  searchResultCount = 0;
  private displayedColumns = [
    { name: "artistName", showMobile: true },
    { name: "albumName", showMobile: false },
    { name: "title", showMobile: true },
    { name: "length", showMobile: false },
    { name: "action", showMobile: true },
  ];

  constructor(
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService,
    private appComponent: AppComponent
  ) {
    this.searchSubs = this.webSocketService.getSearchSubscription();
    this.getResults();
  }

  onPlayTitle(track: IMpdTrack): void {
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    this.popUp(`Playing: ${track.title}`);
  }

  onAddTitle(track: IMpdTrack): void {
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    this.popUp(`Added: ${track.title}`);
  }

  applySearch(searchValue: string) {
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
  /**
   * Listen for results on the websocket channel
   */
  private getResults(): void {
    this.searchSubs.subscribe((message: SearchRootImpl) => {
      try {
        this.processSearchResults(
          message.payload.searchResults,
          message.payload.searchResultCount
        );
      } catch (error) {
        console.error(
          `Error handling message: ${message.type}, error: ${error}`
        );
      }
    });
  }

  private popUp(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
    });
  }

  private resetSearch(): void {
    this.titleQueue = [];
    this.searchResultCount = 0;
  }

  private processSearchResults(searchResults, searchResultCount) {
    this.resetSearch();
    searchResults.forEach((track) => {
      this.titleQueue.push(new QueueTrack(track));
    });
    this.searchResultCount = searchResultCount;
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.appComponent.isMobile();
    return this.displayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
