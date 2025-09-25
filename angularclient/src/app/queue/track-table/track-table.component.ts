import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { filter, map } from "rxjs";
import { AddStreamDialogComponent } from "src/app/queue/track-table/add-stream-dialog/add-stream-dialog.component";
import { MsgService } from "src/app/service/msg.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import { Track } from "src/app/shared/messages/incoming/track";
import {
  InternMsgType,
  PaginationMsg,
} from "src/app/shared/messages/internal/internal-msg";
import { MpdService } from "../../service/mpd.service";
import { QueueService } from "../../service/queue.service";
import { QueueTrack } from "../../shared/model/queue-track";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";
import { SavePlaylistDialogComponent } from "../save-playlist-dialog/save-playlist-dialog.component";
import { NgPlural, NgPluralCase } from "@angular/common";
import { MatFormField, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { TrackTableDataComponent } from "../../shared/track-table-data/track-table-data.component";
import { MatDivider } from "@angular/material/divider";
import { MatButton } from "@angular/material/button";
import { SecondsToHhMmSsPipe } from "../../shared/pipes/seconds-to-hh-mm-ss.pipe";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatIcon,
    MatSuffix,
    TrackTableDataComponent,
    MatDivider,
    NgPlural,
    NgPluralCase,
    MatButton,
    SecondsToHhMmSsPipe,
  ],
})
export class TrackTableComponent {
  private dialog = inject(MatDialog);
  private mpdService = inject(MpdService);
  private msgService = inject(MsgService);
  private queueService = inject(QueueService);
  private responsiveScreenService = inject(ResponsiveScreenService);

  @ViewChild("filterInputElem") filterInputElem?: ElementRef;

  currentTrack: QueueTrack = new QueueTrack();
  currentState = "stop";
  trackTableData = new TrackTableOptions();
  private isMobile = false;

  constructor() {
    this.buildReceiver();
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.queueService.getPage(0, 0);
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
    this.dialog.open(SavePlaylistDialogComponent, {
      width: "50%",
    });
  }

  applyFilter(eventTarget: EventTarget | null): void {
    if (!eventTarget) {
      return;
    }
    const filterValue = (eventTarget as HTMLInputElement).value;
    this.trackTableData.dataSource.filter = filterValue.toLowerCase();
  }

  resetFilter(): void {
    this.trackTableData.dataSource.filter = "";
  }

  openAddStreamDialog(): void {
    this.dialog.open(AddStreamDialogComponent, {
      width: "50%",
    });
  }

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artist-name", showMobile: true },
      { name: "album-name", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "remove", showMobile: true },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }

  private buildTableData(
    queueResponse: PaginatedResponse<Track>,
  ): TrackTableOptions {
    const trackTable = new TrackTableOptions();
    trackTable.addTracks(queueResponse.content);
    trackTable.addTitleColumn = false;
    trackTable.displayedColumns = this.getDisplayedColumns();
    trackTable.dragEnabled = !this.isMobile;
    trackTable.onRowClick = ClickActions.PlayTrack;
    trackTable.pageIndex = queueResponse.number;
    trackTable.pageSize = queueResponse.numberOfElements;
    trackTable.playTitleColumn = false;
    trackTable.totalElements = queueResponse.totalElements;
    trackTable.totalPages = queueResponse.totalPages;
    trackTable.totalPlayTime = queueResponse.totalPlayTime;
    return trackTable;
  }

  private buildReceiver(): void {
    // Queue
    this.queueService.queue$.subscribe(
      (queueResponse: PaginatedResponse<Track>) =>
        (this.trackTableData = this.buildTableData(queueResponse)),
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
      for (const track of this.trackTableData.dataSource.data) {
        track.playing = track.id === this.currentTrack.id;
      }
    });

    // Listen for pagination events
    this.msgService.message
      .pipe(
        filter((msg) => msg.type === InternMsgType.PaginationEvent),
        map((msg) => msg as PaginationMsg),
      )
      .subscribe((msg) => {
        this.queueService.getPage(msg.event.pageIndex, msg.event.pageSize);
      });
  }
}
