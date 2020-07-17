import { Component, HostListener } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs/index";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { QueuePayload } from "../../shared/messages/incoming/queue-payload";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { MatDialog } from "@angular/material/dialog";
import { SavePlaylistModalComponent } from "../save-playlist-modal/save-playlist-modal.component";
import { NotificationService } from "../../shared/services/notification.service";
import { TrackTableData } from "../../shared/track-table/track-table-data";
import { RowClickActions } from "../../shared/track-table/row-click-actions.enum";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";
import {
  DISPLAY_SAVE_PLAYLIST_KEY,
  SettingsService,
} from "../../shared/services/settings.service";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
})
export class TrackTableComponent {
  /**
   * The checksum of the current queue.
   */
  checksum = 0;
  currentSong: QueueTrack = new QueueTrack();
  currentSongObservable: Observable<QueueTrack>;
  currentState = "stop";
  dataSource = new MatTableDataSource<QueueTrack>();
  displaySaveCoverBtn: boolean;
  focus = false;
  trackTableData = new TrackTableData();
  queueDuration = 0;

  constructor(
    private dialog: MatDialog,
    private deviceService: DeviceDetectorService,
    private webSocketService: WebSocketService,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.currentSongObservable = this.mpdService.getSongSubscription();
    this.buildMessageReceiver();
    this.getStateSubscription();
    this.displaySaveCoverBtn = settingsService.getBoolValue(
      DISPLAY_SAVE_PLAYLIST_KEY,
      true
    );
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

  openCoverModal(): void {
    const dialogRef = this.dialog.open(SavePlaylistModalComponent);
    dialogRef.afterClosed().subscribe((playlistName: string) => {
      if (!playlistName) {
        return;
      }
      this.webSocketService.sendData(MpdCommands.SAVE_PLAYLIST, {
        playlistName: playlistName,
      });
      this.mpdService.getPlaylistSavedSubscription().subscribe((msg) => {
        const text = msg.success
          ? `Saved queue as playlist '${msg.playlistName}'`
          : `Error saving queue as playlist '${msg.playlistName}'`;
        this.notificationService.popUp(text);
      });
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetFilter(): void {
    this.dataSource.filter = "";
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "remove", showMobile: true },
    ];
    const isMobile = this.deviceService.isMobile();
    return displayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  private buildQueue(message: QueuePayload): void {
    // Check if the queue has changed. Abort if not.
    if (message.checkSum === this.checksum) {
      return;
    }
    this.checksum = message.checkSum;
    const tmp: QueueTrack[] = [];
    for (const item of message.tracks) {
      tmp.push(new QueueTrack(item));
    }
    this.dataSource.data = tmp; // add the new model object to the trackTableData
    this.trackTableData = this.buildTableData();
    this.queueDuration = this.sumTrackDuration();
  }

  private buildTableData() {
    const trackTable = new TrackTableData();
    trackTable.dataSource = this.dataSource;
    trackTable.clickable = true;
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onRowClick = RowClickActions.PlayTrack;
    trackTable.sortable = true;
    return trackTable;
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
      .subscribe((message: QueuePayload) => this.buildQueue(message));
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

  private getStateSubscription() {
    this.mpdService
      .getStateSubscription()
      .subscribe((state) => (this.currentState = state));
  }
}
