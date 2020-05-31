import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs/index";
import { AppComponent } from "../../app.component";
import {
  IQueuePayload,
  IQueueRoot,
} from "../../shared/messages/incoming/queue";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { WebSocketService } from "../../shared/services/web-socket.service";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
})
export class TrackTableComponent implements OnChanges {
  trackTableData = new MatTableDataSource<QueueTrack>();

  // The checksum of the current queue
  checksum = 0;

  queueDuration = 0;

  @Input() private currentSong: QueueTrack = new QueueTrack();
  private queueSubs: Observable<IQueueRoot>;

  private displayedColumns = [
    { name: "pos", showMobile: false },
    { name: "artist", showMobile: true },
    { name: "album", showMobile: false },
    { name: "title", showMobile: true },
    { name: "length", showMobile: false },
    { name: "remove", showMobile: true },
  ];

  constructor(
    private appComponent: AppComponent,
    private webSocketService: WebSocketService
  ) {
    this.queueSubs = this.webSocketService.getQueueSubscription();
    this.buildQueueMsgReceiver();
  }

  applyFilter(filterValue: string) {
    this.trackTableData.filter = filterValue.trim().toLowerCase();
  }

  resetFilter() {
    this.trackTableData.filter = "";
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.appComponent.isMobile();
    return this.displayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  onRemoveTrack(position: number): void {
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
  onRowClick(pFile: string): void {
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, { path: pFile });
  }

  ngOnChanges(changes: SimpleChanges) {
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
    this.queueDuration = this.sumTrackDuration();
  }

  private buildQueueMsgReceiver() {
    this.queueSubs.subscribe((message: IQueueRoot) => {
      try {
        this.buildQueue(message.payload);
      } catch (error) {
        console.error(
          `Error handling message: ${message.type}, error: ${error}`
        );
      }
    });
  }

  /**
   * Calculate the sum of all track durations.
   */
  private sumTrackDuration(): number {
    let ret = 0.0;
    for (const item of this.trackTableData.data) {
      ret += item.length;
    }
    return ret;
  }
}
