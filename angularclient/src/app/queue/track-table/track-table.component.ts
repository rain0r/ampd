import { NgPlural, NgPluralCase } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDivider } from "@angular/material/divider";
import { MatFormField, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, map, startWith } from "rxjs";
import { AddStreamDialogComponent } from "src/app/queue/track-table/add-stream-dialog/add-stream-dialog.component";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import { Track } from "src/app/shared/messages/incoming/track";
import { MpdService } from "../../service/mpd.service";
import { QueueService } from "../../service/queue.service";
import { QueueTrack } from "../../shared/model/queue-track";
import { SecondsToHhMmSsPipe } from "../../shared/pipes/seconds-to-hh-mm-ss.pipe";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableDataComponent } from "../../shared/track-table-data/track-table-data.component";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";
import { SavePlaylistDialogComponent } from "../save-playlist-dialog/save-playlist-dialog.component";
import { environment } from "src/environments/environment";

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
  private queueService = inject(QueueService);
  private responsiveScreenService = inject(ResponsiveScreenService);
  private activatedRoute = inject(ActivatedRoute);

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

    // Listen for UPDATE_QUEUE Signal
    // When the backend sends a signal that indicates the queue has changed
    // we need to send a new request to fetch it
    // We also need the current page for that to not fetch a wrong page
    const pageAttr = this.activatedRoute.queryParamMap.pipe(
      map((queryParams) => {
        return [
          Number(queryParams.get("pageIndex")),
          Number(queryParams.get("pageSize")),
        ];
      }),
      startWith([0, environment.defaultPageSizeReqParam]),
    );
    combineLatest([
      this.mpdService.signals$.pipe(startWith("UPDATE_QUEUE")),
      pageAttr,
    ]).subscribe(([signal, pageAttr]) => {
      if (signal === "UPDATE_QUEUE") {
        this.queueService.getPage(pageAttr[0], pageAttr[1]);
      }
    });
  }
}
