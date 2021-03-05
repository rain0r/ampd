import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { WebSocketService } from "../services/web-socket.service";
import { TrackTableData } from "./track-table-data";
import { NotificationService } from "../services/notification.service";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { ClickActions } from "./click-actions.enum";
import { MpdCommands } from "../mpd/mpd-commands.enum";
import { QueueTrack } from "../models/queue-track";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-data-table.component.html",
  styleUrls: ["./track-data-table.component.scss"],
})
export class TrackDataTableComponent implements OnChanges {
  @Input() trackTableData: TrackTableData = new TrackTableData();
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );
  @ViewChild(MatSort, { static: true }) sort: MatSort = new MatSort();

  constructor(
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {}

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
      this.webSocketService.sendData(MpdCommands.RM_TRACK, {
        position,
      });
      this.webSocketService.send(MpdCommands.GET_QUEUE);
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
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }

  private addTrack(track: QueueTrack): void {
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Added: ${track.title}`);
    }
  }

  private playTrack(track: QueueTrack): void {
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }
}
