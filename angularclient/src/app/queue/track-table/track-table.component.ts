import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { distinctUntilChanged } from "rxjs/operators";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { Track } from "../../shared/messages/incoming/track";
import { QueueTrack } from "../../shared/models/queue-track";
import { FrontendSettingsService } from "../../service/frontend-settings.service";
import { MpdService } from "../../service/mpd.service";
import { QueueService } from "../../service/queue.service";
import { ClickActions } from "../../shared/track-table/click-actions.enum";
import { TrackTableData } from "../../shared/track-table/track-table-data";
import { AddStreamModalComponent } from "../add-stream-modal/add-stream-modal.component";
import { SavePlaylistModalComponent } from "../save-playlist-modal/save-playlist-modal.component";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
})
export class TrackTableComponent {
  @ViewChild("filterInputElem") filterInputElem?: ElementRef;

  currentTrack: QueueTrack = new QueueTrack();
  currentState = "stop";
  dataSource = new MatTableDataSource<QueueTrack>();
  trackTableData = new TrackTableData();
  queueDuration = 0;
  private isMobile = false;

  constructor(
    private dialog: MatDialog,
    private frontendSettingsService: FrontendSettingsService,
    private mpdService: MpdService,
    private responsiveScreenService: ResponsiveScreenService,
    private queueService: QueueService
  ) {
    this.buildReceiver();
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
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
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.dragEnabled = !this.isMobile;
    trackTable.onRowClick = ClickActions.PlayTrack;
    trackTable.addTitleColumn = false;
    trackTable.playTitleColumn = false;
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
