import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/index';
import { AppComponent } from '../../app.component';
import { IMpdTrack } from '../../shared/messages/incoming/mpd-track';
import { QueueRootImpl } from '../../shared/messages/incoming/queue';
import { QueueTrack } from '../../shared/models/queue-track';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-track-table',
  templateUrl: './track-table.component.html',
  styleUrls: ['./track-table.component.css'],
})
export class TrackTableComponent implements OnChanges {
  public dataSource = new MatTableDataSource<QueueTrack>();
  @Input() private currentSong: QueueTrack = new QueueTrack();
  private queueSubs: Observable<QueueRootImpl>;

  private displayedColumns = [
    { name: 'pos', showMobile: false },
    { name: 'artist', showMobile: true },
    { name: 'album', showMobile: false },
    { name: 'title', showMobile: true },
    { name: 'length', showMobile: false },
    { name: 'remove', showMobile: true },
  ];

  constructor(
    private appComponent: AppComponent,
    private webSocketService: WebSocketService,
    public dialog: MatDialog
  ) {
    this.queueSubs = this.webSocketService.getQueueSubs();
    this.buildQueueMsgReceiver();
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public getDisplayedColumns(): string[] {
    const isMobile = this.appComponent.isMobile();
    return this.displayedColumns
      .filter(cd => !isMobile || cd.showMobile)
      .map(cd => cd.name);
  }

  public onRemoveTrack(position: number): void {
    this.webSocketService.sendData(MpdCommands.RM_TRACK, {
      position,
    });
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  /**
   * Play the track from the queue which has been clicked.
   *
   * @param {string} pFile
   */
  public onRowClick(pFile: string): void {
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, { path: pFile });
  }

  public ngOnChanges(changes: SimpleChanges) {
    const newState: SimpleChange = changes.currentSong;
    if (newState && newState.currentValue) {
      this.currentSong = newState.currentValue;
      for (const track of this.dataSource.data) {
        track.playing = track.id === this.currentSong.id;
        // if (track.id === this.currentSong.id) {
        //   track.playing = true;
        // }
        // else {
        //   track.playing = false;
        // }
      }
    }
  }

  private buildQueue(message: IMpdTrack[]): void {
    const tmp: QueueTrack[] = [];
    let posCounter = 1;
    for (const item of message) {
      const track: QueueTrack = new QueueTrack(item);
      track.pos = posCounter;
      if (this.currentSong.id === item.id) {
        track.playing = true;
      }
      tmp.push(track);
      posCounter += 1;
    }
    this.dataSource.data = tmp; // add the new model object to the dataSource
  }

  private buildQueueMsgReceiver() {
    this.queueSubs.subscribe((message: QueueRootImpl) => {
      try {
        this.buildQueue(message.payload);
      } catch (error) {
        console.error(`Error handling message:`);
        console.error(message);
      }
    });
  }
}
