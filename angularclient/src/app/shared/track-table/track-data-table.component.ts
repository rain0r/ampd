import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { QueueTrack } from "../models/queue-track";
import { MpdCommands } from "../mpd/mpd-commands";
import { WebSocketService } from "../services/web-socket.service";

@Component({
  selector: "app-track-data-table",
  templateUrl: "./track-data-table.component.html",
  styleUrls: ["./track-data-table.component.scss"],
})
export class TrackDataTableComponent implements OnInit {
  /**
   * If true, the onRowClick()-listener are active and sorting is enabled.
   */
  @Input() active = false;

  /**
   * The tracks that will be displayed in the track table.
   */
  @Input() dataSource = new MatTableDataSource<QueueTrack>();

  /**
   * Which columns this track table will have.
   */
  @Input() displayedColumns = [];

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filterInputElem") filterInputElem: ElementRef;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    if (this.active && this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Play the track from the queue which has been clicked.
   *
   * @param {string} file
   */
  onRowClick(file: string): void {
    if (this.active) {
      this.webSocketService.sendData(MpdCommands.PLAY_TRACK, { path: file });
    }
  }

  onRemoveTrack(position: number): void {
    if (this.active) {
      this.webSocketService.sendData(MpdCommands.RM_TRACK, {
        position,
      });
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
  }
}
