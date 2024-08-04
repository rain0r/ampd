import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, Observable } from "rxjs";
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

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-table-data.component.html",
  styleUrls: ["./track-table-data.component.scss"],
})
export class TrackTableDataComponent {
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

  constructor(
    private dialog: MatDialog,
    private msgService: MsgService,
    private queueService: QueueService,
  ) {
    this.trackTableDataObs = this.trackTableData$.asObservable();
  }

  handlePage($event: PageEvent): void {
    this.msgService.sendMessage({
      type: InternMsgType.PaginationEvent,
      event: $event,
    } as PaginationMsg);
  }

  onRowClick(track: QueueTrack): void {
    this.trackTableDataObs.subscribe((trackTableData) => {
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

  onRemoveTrack(position: number): void {
    this.queueService.removeTrack(position);
  }

  onAddTrack(track: QueueTrack): void {
    this.addTrack(track);
  }

  onPlayTrack(track: QueueTrack): void {
    this.trackTableDataObs.subscribe((trackTableData) => {
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
    this.dialog.open(TrackInfoDialogComponent, { data: track });
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
