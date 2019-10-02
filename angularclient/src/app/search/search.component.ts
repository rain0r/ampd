import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild,} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {StompService, StompState} from '@stomp/ng2-stompjs';

import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {AppComponent} from '../app.component';
import {AmpdBlockUiService} from '../shared/block/ampd-block-ui.service';

import {QueueSong} from '../shared/models/queue-song';
import {MpdCommands} from '../shared/mpd/mpd-commands';
import {WebSocketService} from '../shared/services/web-socket.service';
import {SearchRootImpl} from "../shared/messages/incoming/search";
import {IMpdSong} from "../shared/messages/incoming/mpd-song";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements AfterViewInit {
  public searchSubs: Observable<SearchRootImpl>;

  public titleQueue: IMpdSong[] = [];
  public searchResultCount = 0;
  // query: string = '';
  public displayedColumns: string[] = [
    'artistName',
    'albumName',
    'title',
    'length',
    'action',
  ];

  @ViewChild('name', {static: false}) public nameField?: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
              private appComponent: AppComponent,
              private router: Router,
              private snackBar: MatSnackBar,
              private ampdBlockUiService: AmpdBlockUiService,
              private stompService: StompService,
              private webSocketService: WebSocketService,
              private cdRef: ChangeDetectorRef) {
    this.ampdBlockUiService.start();
    this.searchSubs = this.webSocketService.getSearchSubs();

    this.buildConnectionState();
    this.checkQueryParam();
    this.getResults();
  }

  public search(query: string): void {
    console.log(`sending search query: ${query}`);

    // Only search when the term is at least 3 chars long
    if (query && query.length > 3) {
      this.webSocketService.sendData(MpdCommands.SEARCH, {
        query,
      });
    }
  }

  public onPlayTitle(song: IMpdSong): void {
    if (song instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: song.file,
    });
    this.popUp(`Playing: ${song.title}`);
  }

  public onAddTitle(song: IMpdSong): void {
    if (song instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: song.file,
    });
    this.popUp(`Added: ${song.title}`);
  }

  public onSearchKeyUp(): void {
    if (!this.nameField) {
      return;
    }
    const input = this.nameField.nativeElement.value;

    if (input.trim().length === 0) {
      this.clear();
    } else {
      this.search(input);
    }
  }

  public ngAfterViewInit() {
    if (this.nameField) {
      this.nameField.nativeElement.focus();
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
        console.error(`Error handling message:`);
        console.error(message);
      }
    });
  }

  private popUp(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }

  private buildConnectionState(): void {
    this.stompService.state
    .pipe(map((state: number) => StompState[state]))
    .subscribe((status: string) => {
      if (status === 'CONNECTED') {
        this.appComponent.setConnected();
      } else {
        this.appComponent.setDisconnected();
      }
    });
  }

  /**
   * When initially loading this page, check if there is a search query param
   */
  private checkQueryParam(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if ('query' in params) {
        this.search(params.query);
      }
    });
  }

  private clear(): void {
    this.titleQueue = [];
    this.searchResultCount = 0;
  }

  private processSearchResults(searchResults, searchResultCount) {
    this.ampdBlockUiService.stop();
    this.clear();
    searchResults.forEach(song => {
      this.titleQueue.push(new QueueSong(song));
    });
    this.searchResultCount = searchResultCount;
  }
}
