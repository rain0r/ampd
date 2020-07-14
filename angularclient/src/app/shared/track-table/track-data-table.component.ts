import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { WebSocketService } from "../services/web-socket.service";
import { TrackTableData } from "./track-table-data";
import { MpdTrack } from "../messages/incoming/mpd-track";
import { NotificationService } from "../services/notification.service";
import { MatPaginator } from "@angular/material/paginator";
import { RowClickActions } from "./row-click-actions.enum";
import { MpdCommands } from "../mpd/mpd-commands.enum";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-data-table.component.html",
  styleUrls: ["./track-data-table.component.scss"],
})
export class TrackDataTableComponent implements OnChanges {
  @Input() trackTableData: TrackTableData;
  @ViewChild("filterInputElem") filterInputElem: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /**
   * To distinguish double clicks from clicks, we need to listen for a second click.
   */
  private timer = -1;
  private preventSingleClick = false;
  private delay = 300;

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

  onRowClick(track: MpdTrack): void {
    this.preventSingleClick = false;
    this.timer = setTimeout(() => {
      // We'll wait for $delay if this might be a double click
      if (!this.preventSingleClick) {
        this.execRowAction(track, this.trackTableData.onRowClick);
      }
    }, this.delay);
  }

  onRowDoubleClick(track: MpdTrack): void {
    console.log("onRowDoubleClick");
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    this.execRowAction(track, this.trackTableData.onRowDoubleClick);
  }

  onRemoveTrack(position: number): void {
    if (this.trackTableData.clickable) {
      this.webSocketService.sendData(MpdCommands.RM_TRACK, {
        position,
      });
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
  }

  onPlayTrack(track: MpdTrack): void {
    // Since this is triggered via table row icon (-> we're in /browse), we need to add
    // the track first before we can play it
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }

  onAddPlayTrack(track: MpdTrack): void {
    // Since this is triggered via table row icon (-> we're in /browse), we need to add
    // the track first before we can play it
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }

  onAddTrack(track: MpdTrack): void {
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Added: ${track.title}`);
    }
  }

  private execRowAction(track: MpdTrack, action: RowClickActions) {
    if (!this.trackTableData.clickable) {
      return;
    }
    switch (action) {
      case RowClickActions.AddTrack:
        this.onAddTrack(track);
        break;
      case RowClickActions.PlayTrack:
        this.onPlayTrack(track);
        break;
      default:
      // Ignore it
    }
  }
}
