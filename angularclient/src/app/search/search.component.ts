import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { WebSocketService } from '../shared/services/web-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MpdCommands } from '../shared/mpd/mpd-commands';
import { MpdTypes } from '../shared/mpd/mpd-types';
import { Observable } from 'rxjs';
import { MpdSong } from '../shared/mpd/mpd-messages';
import { MatSnackBar } from '@angular/material';
import { AppComponent } from '../app.component';
import { StompService, StompState } from '@stomp/ng2-stompjs';
import { map } from 'rxjs/internal/operators';
import { QueueSong } from '../shared/models/queue-song';
import { AmpdBlockUiService } from '../shared/block/ampd-block-ui.service';
import { ServerStatusRootImpl } from '../shared/mpd/state-messages-impl';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements AfterViewInit {
  stompSubscription: Observable<ServerStatusRootImpl>;
  titleQueue: MpdSong[] = [];
  searchResultCount = 0;
  // query: string = '';
  displayedColumns: string[] = [
    'artistName',
    'albumName',
    'title',
    'length',
    'action',
  ];

  @ViewChild('name') nameField?: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private router: Router,
    private snackBar: MatSnackBar,
    private ampdBlockUiService: AmpdBlockUiService,
    private stompService: StompService,
    private webSocketService: WebSocketService,
    private cdRef: ChangeDetectorRef
  ) {
    this.ampdBlockUiService.start();
    this.stompSubscription = this.webSocketService.getStompSubscription();

    this.buildConnectionState();
    this.checkQueryParam();
    this.getResults();
  }

  /**
   * Listen for results on the websocket channel
   */
  private getResults(): void {
    this.stompSubscription.subscribe((message: any) => {
      if (
        message &&
        'type' in message &&
        message.type === MpdTypes.SEARCH_RESULTS
      ) {
        this.ampdBlockUiService.stop();
        this.clear();

        message.payload.searchResults.forEach(song => {
          this.titleQueue.push(new QueueSong(song));
        });
        this.searchResultCount = message.payload.searchResultCount;
      }
    });
  }

  search(query: string): void {
    console.log(`sending search query: ${query}`);

    // Only search when the term is at least 3 chars long
    if (query && query.length > 3) {
      this.webSocketService.sendData(MpdCommands.SEARCH, {
        query,
      });
    }
  }

  onPlayTitle(song: MpdSong): void {
    if (song instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: song.file,
    });
    this.popUp(`Playing: ${song.title}`);
  }

  onAddTitle(song: MpdSong): void {
    if (song instanceof MouseEvent) {
      return;
    }
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: song.file,
    });
    this.popUp(`Added: ${song.title}`);
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

  onSearchKeyUp(): void {
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

  ngAfterViewInit() {
    if (this.nameField) {
      this.nameField.nativeElement.focus();
    }

    this.cdRef.detectChanges();
  }

  /**
   * When initially loading this page, check if there is a search query param
   */
  private checkQueryParam(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if ('query' in params) {
        this.search(params['query']);
      }
    });
  }

  private clear(): void {
    this.titleQueue = [];
    this.searchResultCount = 0;
  }
}
