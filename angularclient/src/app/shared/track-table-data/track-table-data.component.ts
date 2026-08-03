import { CdkDrag, CdkDragDrop, CdkDropList } from "@angular/cdk/drag-drop";
import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  inject,
  input,
} from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";

import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { take } from "rxjs";
import { TrackInfoDialogComponent } from "../../browse/tracks/track-info-dialog/track-info-dialog.component";
import { QueueService } from "../../service/queue.service";
import { Track } from "../messages/incoming/track";
import { QueueTrack } from "../model/queue-track";
import { SecondsToMmSsPipe } from "../pipes/seconds-to-mm-ss.pipe";
import { ClickActions } from "./click-actions.enum";
import { TrackTableOptions } from "./track-table-options";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-table-data.component.html",
  styleUrls: ["./track-table-data.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private queueService = inject(QueueService);
  private router = inject(Router);

  trackTableData = input.required<TrackTableOptions>();
  trackTableDataObs = toObservable(this.trackTableData);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator();

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.trackTableDataObs
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((d) => (d.dataSource.sort = sort));
  }

  handlePage($event: PageEvent): void {
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { pageIndex: $event.pageIndex, pageSize: $event.pageSize },
      queryParamsHandling: "merge",
    });
  }

  onRowClick(track: QueueTrack): void {
    this.trackTableDataObs
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((trackTableData) => {
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
    this.trackTableDataObs
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((trackTableData) => {
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
