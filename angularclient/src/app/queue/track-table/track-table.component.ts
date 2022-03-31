import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { MatDialog } from "@angular/material/dialog";
import { SavePlaylistModalComponent } from "../save-playlist-modal/save-playlist-modal.component";
import { TrackTableData } from "../../shared/track-table/track-table-data";
import { ClickActions } from "../../shared/track-table/click-actions.enum";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { distinctUntilChanged, map } from "rxjs/operators";
import { Track } from "../../shared/messages/incoming/track";
import { AddStreamModalComponent } from "../add-stream-modal/add-stream-modal.component";
import { QueueService } from "../../shared/services/queue.service";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
})
export class TrackTableComponent implements OnInit {
  @ViewChild("filterInputElem") filterInputElem?: ElementRef;

  currentTrack: QueueTrack = new QueueTrack();
  currentState = "stop";
  dataSource = new MatTableDataSource<QueueTrack>();
  isMobile = false;
  trackTableData = new TrackTableData();
  queueDuration = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private frontendSettingsService: FrontendSettingsService,
    private mpdService: MpdService,
    private queueService: QueueService
  ) {
    this.buildReceiver();
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

  openSavePlaylistModal(): void {
    this.dialog.open(SavePlaylistModalComponent, {
      panelClass: this.frontendSettingsService.darkTheme$.value
        ? "dark-theme"
        : "",
    });
  }

  applyFilter(eventTarget: EventTarget | null): void {
    if (!eventTarget) {
      return;
    }
    const filterValue = (<HTMLInputElement>eventTarget).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  resetFilter(): void {
    this.dataSource.filter = "";
  }

  openAddStreamModal(): void {
    this.dialog.open(AddStreamModalComponent, {
      panelClass: this.frontendSettingsService.darkTheme$.value
        ? "dark-theme"
        : "",
    });
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

  private buildQueue(tracks: Track[]): void {
    /* add the new model object to the trackTableData */
    this.dataSource.data = tracks.map(
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
    trackTable.dragEnabled = !this.isMobile;
    trackTable.onRowClick = ClickActions.PlayTrack;
    trackTable.sortable = true;
    return trackTable;
  }

  private buildReceiver(): void {
    // Current track
    this.mpdService.currentTrack.subscribe((track) => {
      if (this.currentState !== "stop") {
        this.currentTrack = track;
      }
      for (const track of this.dataSource.data) {
        track.playing = track.id === this.currentTrack.id;
      }
    });

    // Queue
    this.queueService
      .getQueueSubscription()
      .subscribe((message: Track[]) => this.buildQueue(message));
    // State
    this.mpdService.currentState
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        this.currentState = state;
        if (state === "stop") {
          this.currentTrack = new QueueTrack();
        }
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
