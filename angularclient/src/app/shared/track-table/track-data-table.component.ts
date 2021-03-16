import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { TrackTableData } from "./track-table-data";
import { NotificationService } from "../services/notification.service";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { ClickActions } from "./click-actions.enum";
import { QueueTrack } from "../models/queue-track";
import { Observable } from "rxjs";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { QueueService } from "../services/queue.service";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-data-table.component.html",
  styleUrls: ["./track-data-table.component.scss"],
})
export class TrackDataTableComponent implements OnInit, OnChanges {
  @Input() trackTableData: TrackTableData = new TrackTableData();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();

  isMobile = new Observable<boolean>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private queueService: QueueService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("trackTableData" in changes) {
      const tableData: TrackTableData = <TrackTableData>(
        changes.trackTableData.currentValue
      );
      if (tableData.dataSource.data.length > 0) {
        if (tableData.sortable) {
          this.trackTableData.dataSource.sort = this.sort;
        }
        if (tableData.pagination) {
          this.trackTableData.dataSource.paginator = this.paginator;
        }
      }
    }
  }

  onRowClick(track: QueueTrack): void {
    if (!this.trackTableData.clickable) {
      return;
    }
    switch (this.trackTableData.onRowClick) {
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
  }

  onRemoveTrack(position: number): void {
    if (this.trackTableData.clickable) {
      this.queueService.removeTrack(position);
      this.queueService.getQueue();
    }
  }

  onAddTrack(track: QueueTrack): void {
    this.addTrack(track);
  }

  onPlayTrack(track: QueueTrack): void {
    switch (this.trackTableData.onPlayClick) {
      case ClickActions.PlayTrack:
        this.playTrack(track);
        break;
      case ClickActions.AddPlayTrack:
        this.addPlayTrack(track);
        break;
      default:
      // Ignore it
    }
  }

  private addPlayTrack(track: QueueTrack): void {
    this.queueService.addPlayTrack(track.file);
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }

  private addTrack(track: QueueTrack): void {
    this.queueService.addTrack(track.file);
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Added: ${track.title}`);
    }
  }

  private playTrack(track: QueueTrack): void {
    this.queueService.playTrack(track.file);
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }
}
