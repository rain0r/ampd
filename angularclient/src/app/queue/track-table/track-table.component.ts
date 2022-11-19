import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { filter, map } from "rxjs";
import { MsgService } from "src/app/service/msg.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { QueueResponse } from "src/app/shared/messages/incoming/queue-response";
import {
  InternMsgType,
  PaginationMsg,
} from "src/app/shared/messages/internal/internal-msg";
import { AddStreamDialogComponent } from "../../browse/add-radio-stream/add-radio-stream.component";
import { MpdService } from "../../service/mpd.service";
import { QueueService } from "../../service/queue.service";
import { QueueTrack } from "../../shared/model/queue-track";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";
import { SavePlaylistDialogComponent } from "../save-playlist-dialog/save-playlist-dialog.component";

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
  trackTableData = new TrackTableOptions();
  private isMobile = false;

  constructor(
    private dialog: MatDialog,
    private mpdService: MpdService,
    private msgService: MsgService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService
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

  openSavePlaylistDialog(): void {
    this.dialog.open(SavePlaylistDialogComponent);
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

  openAddStreamDialog(): void {
    this.dialog.open(AddStreamDialogComponent);
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

  private buildQueue(queueResponse: QueueResponse): void {
    /* add the new model object to the trackTableData */
    this.dataSource.data = queueResponse.content.map(
      (track, index) => new QueueTrack(track, index)
    );
    this.trackTableData = this.buildTableData(queueResponse);
  }

  private buildTableData(queueResponse: QueueResponse): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.dataSource = this.dataSource;
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.dragEnabled = !this.isMobile;
    trackTable.onRowClick = ClickActions.PlayTrack;
    trackTable.addTitleColumn = false;
    trackTable.playTitleColumn = false;
    trackTable.pageSize = queueResponse.numberOfElements;
    trackTable.pageIndex = queueResponse.number;
    trackTable.totalElements = queueResponse.totalElements;
    trackTable.totalPages = queueResponse.totalPages;
    trackTable.totalPlayTime = queueResponse.totalPlayTime;
    trackTable.pagination = true;
    return trackTable;
  }

  private buildReceiver(): void {
    // Queue
    this.queueService
      .getQueueSubscription()
      .subscribe((queueResponse: QueueResponse) =>
        this.buildQueue(queueResponse)
      );

    // State
    this.mpdService.currentState$.subscribe((state) => {
      this.currentState = state;
      if (state === "stop") {
        this.currentTrack = new QueueTrack();
      }
    });

    // Current track
    this.mpdService.currentTrack$.subscribe((track) => {
      if (this.currentState !== "stop") {
        this.currentTrack = track;
      }
      for (const track of this.dataSource.data) {
        track.playing = track.id === this.currentTrack.id;
      }
    });

    // Listen for pagination events
    this.msgService.message
      .pipe(
        filter((msg) => msg.type === InternMsgType.PaginationEvent),
        map((msg) => <PaginationMsg>msg)
      )
      .subscribe((msg) => {
        this.queueService.getPage(msg.event.pageIndex, msg.event.pageSize);
      });
  }
}
