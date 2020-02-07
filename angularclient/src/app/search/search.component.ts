import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { IMpdTrack } from '../shared/messages/incoming/mpd-track';
import { SearchRootImpl } from '../shared/messages/incoming/search';
import { QueueTrack } from '../shared/models/queue-track';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { WebSocketService } from '../shared/services/web-socket.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements AfterViewInit {
  public searchSubs: Observable<SearchRootImpl>;
  public titleQueue: IMpdTrack[] = [];
  public searchResultCount = 0;
  public displayedColumns: string[] = [
    'artistName',
    'albumName',
    'title',
    'length',
    'action',
  ];

  @ViewChild('search', { static: false }) public searchField?: ElementRef;

  constructor(
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService,
    private cdRef: ChangeDetectorRef
  ) {
    this.searchSubs = this.webSocketService.getSearchSubs();
    this.getResults();
  }

  public search(query: string): void {
    // Only search when the term is at least 3 chars long
    if (query && query.length > 3) {
      this.webSocketService.sendData(MpdCommands.SEARCH, {
        query,
      });
    }
  }

  public onPlayTitle(track: IMpdTrack): void {
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    this.popUp(`Playing: ${track.title}`);
  }

  public onAddTitle(track: IMpdTrack): void {
    if (track instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    this.popUp(`Added: ${track.title}`);
  }

  public onSearchKeyUp(): void {
    if (!this.searchField) {
      return;
    }
    const input = this.searchField.nativeElement.value;

    if (input.trim().length === 0) {
      this.clear();
    } else {
      this.search(input);
    }
  }

  public ngAfterViewInit() {
    if (this.searchField) {
      this.searchField.nativeElement.focus();
    }

    this.cdRef.detectChanges();
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
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }

  /**
   * When initially loading this page, check if there is a search query param
   */
  // private checkQueryParam(): void {
  //   this.activatedRoute.queryParams.subscribe(params => {
  //     if ('query' in params) {
  //       this.search(params.query);
  //     }
  //   });
  // }

  private clear(): void {
    this.titleQueue = [];
    this.searchResultCount = 0;
  }

  private processSearchResults(searchResults, searchResultCount) {
    this.clear();
    searchResults.forEach(track => {
      this.titleQueue.push(new QueueTrack(track));
    });
    this.searchResultCount = searchResultCount;
  }
}
