import { CdkDragDrop } from "@angular/cdk/drag-drop";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";
import { TrackInfoDialogComponent } from "src/app/browse/tracks/track-info-dialog/track-info-dialog.component";
import { NotificationService } from "../../service/notification.service";
import { QueueService } from "../../service/queue.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { QueueTrack } from "../model/queue-track";
import { Track } from "./../messages/incoming/track";
import { ClickActions } from "./click-actions.enum";
import { TrackTableData } from "./track-table-data";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-table-data.component.html",
  styleUrls: ["./track-table-data.component.scss"],
})
export class TrackTableDataComponent implements OnInit, OnChanges {
  @Input() trackTableData: TrackTableData = new TrackTableData();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();

  isMobile = new Observable<boolean>();

  constructor(
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isMobile = this.responsiveScreenService.isMobile();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("trackTableData" in changes) {
      const tableData: TrackTableData = <TrackTableData>(
        changes["trackTableData"].currentValue
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

  onListDrop(event: CdkDragDrop<QueueTrack[]>): void {
    // Swap the elements around
    this.queueService.moveTrack(event.previousIndex, event.currentIndex);
  }

  onShowTrackInfo(track: Track): void {
    this.isMobile.subscribe((isMobile) => {
      const width = isMobile ? "100%" : "70%";
      const options: MatDialogConfig = {
        maxWidth: "100vw",
        height: "90%",
        width: width,
        data: track,
      };
      if (isMobile) {
        options["height"] = "75%";
        options["maxHeight"] = "75vh";
      }
      this.dialog.open(TrackInfoDialogComponent, options);
    });
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
