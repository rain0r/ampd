import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
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
export class TrackTableComponent {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filterInputElem") filterInputElem: ElementRef;
  currentSong: QueueTrack = new QueueTrack();
  currentSongObservable: Observable<QueueTrack>;
  dataSource = new MatTableDataSource<QueueTrack>();
  checksum = 0; // The checksum of the current queue
  queueDuration = 0;
  focus = false;

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
    this.currentSongObservable = this.mpdService.getSongSubscription();
    this.buildMessageReceiver();
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
   * @param {string} file
   */
  onRowClick(file: string): void {
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, { path: file });
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
      tmp.push(track);
      posCounter += 1;
    }
    this.dataSource.data = tmp; // add the new model object to the trackTableData
    this.dataSource.sort = this.sort;
    this.queueDuration = this.sumTrackDuration();
  }

  private buildMessageReceiver(): void {
    this.mpdService.getSongSubscription().subscribe((song) => {
      this.currentSong = song;
      for (const track of this.dataSource.data) {
        track.playing = track.id === this.currentSong.id;
      }
    });
    this.webSocketService
      .getQueueSubscription()
      .subscribe((message: IQueuePayload) => this.buildQueue(message));
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
