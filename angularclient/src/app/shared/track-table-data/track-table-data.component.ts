import { CdkDrag, CdkDragDrop, CdkDropList } from "@angular/cdk/drag-drop";
import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
  input,
  signal,
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
import { combineLatest, map, take } from "rxjs";
import { TrackInfoDialogComponent } from "../../browse/tracks/track-info-dialog/track-info-dialog.component";
import { QueueService } from "../../service/queue.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { Track } from "../messages/incoming/track";
import { QueueTrack } from "../model/queue-track";
import { SecondsToMmSsPipe } from "../pipes/seconds-to-mm-ss.pipe";
import { ClickActions } from "./click-actions.enum";
import { COLUMNS } from "./columns";
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
export class TrackTableDataComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private queueService = inject(QueueService);
  private responsiveScreenService = inject(ResponsiveScreenService);
  private router = inject(Router);

  displayedColumns = signal<string[]>([]);
  trackTableData = input.required<TrackTableOptions>();
  trackTableDataObs = toObservable(this.trackTableData);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    new MatPaginator();

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.trackTableDataObs
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((d) => (d.dataSource.sort = sort));
  }

  ngOnInit(): void {
    const tableOpt = this.trackTableDataObs.pipe(
      takeUntilDestroyed(this.destroyRef),
    );
    const isMobile = this.responsiveScreenService.isMobile().pipe(
      takeUntilDestroyed(this.destroyRef),
      map((isMobile) => {
        return COLUMNS.filter((cd) => !isMobile || cd.showMobile).map(
          (cd) => cd.name,
        );
      }),
    );
    combineLatest([tableOpt, isMobile]).subscribe(([tableOpt, columns]) => {
      // Weed out add and play columns since they are specified in TrackTableOptions
      let ret = columns;
      if (!tableOpt.addTitleColumn) {
        ret = ret.filter((name) => name !== "add-title");
      }
      if (!tableOpt.playTitleColumn) {
        ret = ret.filter((name) => name !== "play-title");
      }
      this.displayedColumns.set(ret);
    });
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
