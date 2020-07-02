import {
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs/index";

import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { IQueuePayload } from "../../shared/messages/incoming/queue-payload";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
})
export class TrackTableComponent implements OnInit, OnChanges {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filterInputElem") filterInputElem: ElementRef;
  currentSong: QueueTrack = new QueueTrack();
  currentSongObservable: Observable<QueueTrack>;
  dataSource = new MatTableDataSource<QueueTrack>();
  checksum = 0; // The checksum of the current queue
  queueDuration = 0;
  focus = false;
  private queueSubs: Observable<IQueuePayload>;
  private displayedColumns = [
    { name: "pos", showMobile: false },
    { name: "artistName", showMobile: true },
    { name: "albumName", showMobile: false },
    { name: "title", showMobile: true },
    { name: "length", showMobile: false },
    { name: "remove", showMobile: true },
  ];

  constructor(
    private deviceService: DeviceDetectorService,
    private webSocketService: WebSocketService,
    private mpdService: MpdService
  ) {
    this.queueSubs = this.webSocketService.getQueueSubscription();
    this.currentSongObservable = this.mpdService.getSongSubscription();
  }

  @HostListener("document:keydown.f", ["$event"])
  onSearchKeydownHandler(event: KeyboardEvent): void {
    // Don't focus on the 'search' input when we're typing an 's' in the 'add' input
    // Also, if we're already in the 'search' input, there is no need to focus
    const isFromInput = (event.target as HTMLInputElement).tagName === "INPUT";
    if (!isFromInput) {
      event.preventDefault();
      this.focus = true;
    }
  }

  ngOnInit(): void {
    this.buildQueueMsgReceiver();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetFilter(): void {
    this.dataSource.filter = "";
  }

  getDisplayedColumns(): string[] {
    const isMobile = this.deviceService.isMobile();
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

  ngOnChanges(changes: SimpleChanges): void {
    const newState: SimpleChange = changes.currentSong;
    if (newState && newState.currentValue) {
      this.currentSong = <QueueTrack>newState.currentValue;
      for (const track of this.dataSource.data) {
        track.playing = track.id === this.currentSong.id;
      }
    }
  }

  private buildQueue(message: IQueuePayload): void {
    console.log(`${new Date()} buildQueue`);
    // Check if the queue has changed. Abort if not.
    if (message.checkSum === this.checksum) {
      console.log("Nothing changed, return");
      console.log("message.checkSum", message.checkSum)
      console.log("this.checksum", this.checksum)
      return;
    }

    this.checksum = message.checkSum;
    const tmp: QueueTrack[] = [];
    let posCounter = 1;
    for (const item of message.tracks) {
      const track: QueueTrack = new QueueTrack(item);
      track.pos = posCounter;
      // console.log("this.currentSong.id", this.currentSong);
      // console.log("item.id", item.id);
      if (this.currentSong.id === item.id) {
        console.log("Setting playing to true");
        track.playing = true;
      }
      tmp.push(track);
      posCounter += 1;
    }

    this.dataSource.data = tmp; // add the new model object to the trackTableData

    this.dataSource.sort = this.sort;
    this.queueDuration = this.sumTrackDuration();
  }

  private buildQueueMsgReceiver(): void {
    this.mpdService.getSongSubscription().subscribe((song) => {
      this.currentSong = song;
      this.queueSubs.subscribe((message: IQueuePayload) =>
        this.buildQueue(message)
      );
    });
  }

  /**
   * Calculate the sum of all track durations.
   */
  private sumTrackDuration(): number {
    let ret = 0.0;
    for (const item of this.dataSource.data) {
      ret += item.length;
    }
    return ret;
  }
}
