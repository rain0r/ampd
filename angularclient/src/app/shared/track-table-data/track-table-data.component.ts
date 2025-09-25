import { CdkDragDrop, CdkDropList, CdkDrag } from "@angular/cdk/drag-drop";
import {
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  inject,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from "@angular/material/paginator";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { BehaviorSubject, Observable, take } from "rxjs";
import { TrackInfoDialogComponent } from "src/app/browse/tracks/track-info-dialog/track-info-dialog.component";
import { MsgService } from "src/app/service/msg.service";
import { QueueService } from "../../service/queue.service";
import { Track } from "../messages/incoming/track";
import { QueueTrack } from "../model/queue-track";
import {
  InternMsgType,
  PaginationMsg,
} from "./../messages/internal/internal-msg";
import { ClickActions } from "./click-actions.enum";
import { TrackTableOptions } from "./track-table-options";
import { AsyncPipe } from "@angular/common";
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatNoDataRow,
} from "@angular/material/table";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { SecondsToMmSsPipe } from "../pipes/seconds-to-mm-ss.pipe";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-table-data.component.html",
  styleUrls: ["./track-table-data.component.scss"],
  imports: [
    MatTable,
    CdkDropList,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatIcon,
    MatButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CdkDrag,
    MatNoDataRow,
    MatPaginator,
    AsyncPipe,
    SecondsToMmSsPipe,
  ],
})
export class TrackTableDataComponent {
  private dialog = inject(MatDialog);
  private msgService = inject(MsgService);
  private queueService = inject(QueueService);

  @Input() set trackTableData(trackTableData: TrackTableOptions) {
    this.trackTableData$.next(trackTableData);
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.trackTableDataObs.subscribe((d) => (d.dataSource.sort = sort));
  }

  trackTableDataObs: Observable<TrackTableOptions>;
  private trackTableData$ = new BehaviorSubject<TrackTableOptions>(
    new TrackTableOptions(),
  );

  constructor() {
    this.trackTableDataObs = this.trackTableData$.asObservable();
  }

  handlePage($event: PageEvent): void {
    this.msgService.sendMessage({
      type: InternMsgType.PaginationEvent,
      event: $event,
    } as PaginationMsg);
  }

  onRowClick(track: QueueTrack): void {
    this.trackTableDataObs.pipe(take(1)).subscribe((trackTableData) => {
      if (!trackTableData.clickable) {
        return;
      }
      switch (trackTableData.onRowClick) {
        case ClickActions.AddTrack:
          this.addTrack(track);
          break;
        case ClickActions.PlayTrack:
          this.playTrack(track);
          break;
        case ClickActions.AddPlayTrack:
          this.addPlayTrack(track);
          break;
        default:
        // Ignore it
      }
    });
  }

  onRemoveTrack(track: QueueTrack): void {
    this.queueService.removeTrack(track.position);
  }

  onAddTrack(track: QueueTrack): void {
    this.addTrack(track);
  }

  onPlayTrack(track: QueueTrack): void {
    this.trackTableDataObs.pipe(take(1)).subscribe((trackTableData) => {
      switch (trackTableData.onPlayClick) {
        case ClickActions.PlayTrack:
          this.playTrack(track);
          break;
        case ClickActions.AddPlayTrack:
          this.addPlayTrack(track);
          break;
        default:
        // Ignore it
      }
    });
  }

  onListDrop(event: CdkDragDrop<QueueTrack[]>): void {
    // Swap the elements around
    this.queueService.moveTrack(event.previousIndex, event.currentIndex);
  }

  onShowTrackInfo(track: Track): void {
    this.dialog.open(TrackInfoDialogComponent, { data: track, width: "80%" });
  }

  private addPlayTrack(track: QueueTrack): void {
    this.queueService.addPlayQueueTrack(track);
  }

  private addTrack(track: QueueTrack): void {
    this.queueService.addQueueTrack(track);
  }

  private playTrack(track: QueueTrack): void {
    this.queueService.playQueueTrack(track);
  }
}
