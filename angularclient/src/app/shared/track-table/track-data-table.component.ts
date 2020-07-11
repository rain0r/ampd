import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MpdCommands } from "../mpd/mpd-commands";
import { WebSocketService } from "../services/web-socket.service";
import { TrackTableData } from "./track-table-data";
import { MpdTrack } from "../messages/incoming/mpd-track";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-data-table.component.html",
  styleUrls: ["./track-data-table.component.scss"],
})
export class TrackDataTableComponent implements OnChanges {
  @Input() trackTableData: TrackTableData;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filterInputElem") filterInputElem: ElementRef;

  constructor(
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ("trackTableData" in changes) {
      const hugo: TrackTableData = <TrackTableData>(
        changes.trackTableData.currentValue
      );
      if (hugo.dataSource.data.length > 0 && hugo.sortable) {
        this.trackTableData.dataSource.sort = this.sort;
      }
    }
  }

  /**
   * Play the track from the queue which has been clicked.
   *
   * @param {string} file
   */
  onRowClick(file: string): void {
    if (this.trackTableData.clickable) {
      this.webSocketService.sendData(MpdCommands.PLAY_TRACK, { path: file });
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

  onPlayTitle(track: MpdTrack): void {
    this.webSocketService.sendData(MpdCommands.ADD_PLAY_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Playing: ${track.title}`);
  }

  onAddTitle(track: MpdTrack): void {
    this.webSocketService.sendData(MpdCommands.ADD_TRACK, {
      path: track.file,
    });
    this.notificationService.popUp(`Added: ${track.title}`);
  }
}
