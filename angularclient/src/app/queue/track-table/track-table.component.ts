import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";

import { WebSocketService } from "../../shared/services/web-socket.service";
import { QueuePayload } from "../../shared/messages/incoming/queue-payload";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { MatDialog } from "@angular/material/dialog";
import { SavePlaylistModalComponent } from "../save-playlist-modal/save-playlist-modal.component";
import { TrackTableData } from "../../shared/track-table/track-table-data";
import { ClickActions } from "../../shared/track-table/click-actions.enum";
import { SettingsService } from "../../shared/services/settings.service";
import { Observable } from "rxjs";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { map } from "rxjs/operators";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
})
export class TrackTableComponent implements OnInit {
  @ViewChild("filterInputElem") filterInputElem?: ElementRef;

  /**
   * The checksum of the current queue.
   */
  checksum = 0;
  currentTrack: QueueTrack = new QueueTrack();
  currentState = "stop";
  dataSource = new MatTableDataSource<QueueTrack>();
  displaySaveCoverBtn: Observable<boolean>;
  isMobile = false;
  trackTableData = new TrackTableData();
  queueDuration = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private webSocketService: WebSocketService,
    private mpdService: MpdService,
    private settingsService: SettingsService
  ) {
    this.buildMessageReceiver();
    this.getStateSubscription();
    this.displaySaveCoverBtn = settingsService.isDisplaySavePlaylist;
  }

  @HostListener("document:keydown.f", ["$event"])
  onFocusKeydownHandler(event: KeyboardEvent): void {
    if ((event.target as HTMLInputElement).tagName === "INPUT") {
      return;
    }
    event.preventDefault();
    if (this.filterInputElem) {
      (this.filterInputElem.nativeElement as HTMLElement).focus();
    }
  }
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  openCoverModal(): void {
    this.dialog.open(SavePlaylistModalComponent, {
      panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
    });
  }

  applyFilter(eventTarget: EventTarget | null): void {
    if (!eventTarget) {
      return;
    }
    const filterValue = (<HTMLInputElement>eventTarget).value;
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
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  private buildQueue(message: QueuePayload): void {
    // Check if the queue has changed. Abort if it hasn't.
    if (message.checkSum === this.checksum) {
      return;
    }
    this.checksum = message.checkSum;
    /* add the new model object to the trackTableData */
    this.dataSource.data = message.tracks.map(
      (track, index) => new QueueTrack(track, index)
    );
    this.trackTableData = this.buildTableData();
    this.queueDuration = this.sumTrackDuration();
  }

  private buildTableData(): TrackTableData {
    const trackTable = new TrackTableData();
    trackTable.dataSource = this.dataSource;
    trackTable.clickable = true;
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.onRowClick = ClickActions.PlayTrack;
    trackTable.sortable = true;
    return trackTable;
  }

  private buildMessageReceiver(): void {
    this.mpdService.currentTrack.subscribe((track) => {
      this.currentTrack = track;
      for (const track of this.dataSource.data) {
        track.playing = track.id === this.currentTrack.id;
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

  private getStateSubscription(): void {
    this.mpdService.currentState.subscribe(
      (state) => (this.currentState = state)
    );
  }
}
