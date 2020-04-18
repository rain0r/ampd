import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs/index';
import { AppComponent } from '../../app.component';
import {
  IQueuePayload,
  QueueRootImpl,
} from '../../shared/messages/incoming/queue';
import { QueueTrack } from '../../shared/models/queue-track';
import { MpdCommands } from '../../shared/mpd/mpd-commands';
import { WebSocketService } from '../../shared/services/web-socket.service';

@Component({
  selector: 'app-track-table',
  templateUrl: './track-table.component.html',
  styleUrls: ['./track-table.component.scss'],
})
export class TrackTableComponent implements OnChanges {
  public trackTableData = new MatTableDataSource<QueueTrack>();

  // The checksum of the current queue
  public checksum = 0;

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
    private webSocketService: WebSocketService
  ) {
    this.queueSubs = this.webSocketService.getQueueSubscription();
    this.buildQueueMsgReceiver();
  }

  public applyFilter(filterValue: string) {
    this.trackTableData.filter = filterValue.trim().toLowerCase();
  }

  public resetFilter() {
    this.trackTableData.filter = '';
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
      for (const track of this.trackTableData.data) {
        track.playing = track.id === this.currentSong.id;
      }
    }
  }

  private buildQueue(message: IQueuePayload): void {
    // Check if the queue has changed. Abort if not.
    if (message.checkSum === this.checksum) {
      return;
    }

    this.checksum = message.checkSum;
    const tmp: QueueTrack[] = [];
    let posCounter = 1;
    for (const item of message.tracks) {
      const track: QueueTrack = new QueueTrack(item);
      track.pos = posCounter;
      if (this.currentSong.id === item.id) {
        track.playing = true;
      }
      tmp.push(track);
      posCounter += 1;
    }
    this.trackTableData.data = tmp; // add the new model object to the trackTableData
  }

  private buildQueueMsgReceiver() {
    this.queueSubs.subscribe((message: QueueRootImpl) => {
      try {
        this.buildQueue(message.payload);
      } catch (error) {
        console.error(
          `Error handling message: ${message.type}, error: ${error}`
        );
      }
    });
  }
}
