import { NgPlural, NgPluralCase } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDivider } from "@angular/material/divider";
import { MatFormField, MatSuffix } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, map, startWith } from "rxjs";
import { environment } from "../../../environments/environment";
import { MpdService } from "../../service/mpd.service";
import { QueueService } from "../../service/queue.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { PaginatedResponse } from "../../shared/messages/incoming/paginated-response";
import { Track } from "../../shared/messages/incoming/track";
import { QueueTrack } from "../../shared/model/queue-track";
import { SecondsToHhMmSsPipe } from "../../shared/pipes/seconds-to-hh-mm-ss.pipe";
import { ClickActions } from "../../shared/track-table-data/click-actions.enum";
import { TrackTableDataComponent } from "../../shared/track-table-data/track-table-data.component";
import { TrackTableOptions } from "../../shared/track-table-data/track-table-options";
import { SavePlaylistDialogComponent } from "../save-playlist-dialog/save-playlist-dialog.component";
import { AddStreamDialogComponent } from "./add-stream-dialog/add-stream-dialog.component";

@Component({
  selector: "app-track-table",
  templateUrl: "./track-table.component.html",
  styleUrls: ["./track-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private mpdService = inject(MpdService);
  private queueService = inject(QueueService);
  private responsiveScreenService = inject(ResponsiveScreenService);

  @ViewChild("filterInputElem") filterInputElem?: ElementRef;

  currentTrack = signal<QueueTrack>(new QueueTrack());
  currentState = signal<"stop" | "play" | "pause">("stop");
  trackTableData = signal<TrackTableOptions>(new TrackTableOptions());

  constructor() {
    this.buildReceiver();
    this.queueService.getPage(
      Number(this.activatedRoute.snapshot.queryParamMap.get("pageIndex")),
      Number(this.activatedRoute.snapshot.queryParamMap.get("pageSize")),
    );
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
    this.trackTableData().dataSource.filter = filterValue.toLowerCase();
  }

  resetFilter(): void {
    this.trackTableData().dataSource.filter = "";
  }

  openAddStreamDialog(): void {
    this.dialog.open(AddStreamDialogComponent, {
      width: "50%",
    });
  }

  private buildTableData(
    queueResponse: PaginatedResponse<Track>,
    isMobile: boolean,
  ): TrackTableOptions {
    const trackTable = new TrackTableOptions({
      addTitleColumn: false,
      dragEnabled: !isMobile,
      onRowClick: ClickActions.PlayTrack,
      pageIndex: queueResponse.number,
      pageSize: queueResponse.pageable.pageSize,
      playTitleColumn: false,
      totalElements: queueResponse.totalElements,
      totalPages: queueResponse.totalPages,
      totalPlayTime: queueResponse.totalPlayTime,
    });
    trackTable.addTracks(queueResponse.content);
    return trackTable;
  }

  private buildReceiver(): void {
    // Queue
    const queue = this.queueService.queue$.pipe(
      takeUntilDestroyed(this.destroyRef),
    );
    combineLatest([queue, this.responsiveScreenService.isMobile()]).subscribe(
      ([queueResponse, isMobile]) => {
        this.trackTableData.set(this.buildTableData(queueResponse, isMobile));
      },
    );

    // State
    this.mpdService.currentState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.currentState.set(state);
        if (state === "stop") {
          this.currentTrack.set(new QueueTrack());
        }
      });

    // Current track
    this.mpdService.currentTrack$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((track) => {
        if (this.currentState() !== "stop") {
          this.currentTrack.set(track);
        }
        for (const track of this.trackTableData().dataSource.data) {
          track.playing = track.id === this.currentTrack().id;
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
