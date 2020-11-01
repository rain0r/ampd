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
import { ClickActions } from "./click-actions.enum";
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

  onAddTrack(track: MpdTrack): void {
    this.addTrack(track);
  }

  onPlayTrack(track: MpdTrack): void {
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

  private addPlayTrack(track: MpdTrack): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }

  private addTrack(track: MpdTrack): void {
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Added: ${track.title}`);
    }
  }

  private playTrack(track: MpdTrack): void {
    this.webSocketService.sendData(MpdCommands.PLAY_TRACK, {
      path: track.file,
    });
    if (this.trackTableData.notify) {
      this.notificationService.popUp(`Playing: ${track.title}`);
    }
  }
}
