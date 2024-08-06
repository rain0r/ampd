import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { QueueService } from "src/app/service/queue.service";
import { RadioStreamService } from "src/app/service/radio-stream.service";
import { RadioStream } from "../../../shared/model/db/radio-stream";
import { ConfirmDeleteStreamDialogComponent } from "../confirm-delete-stream-dialog/confirm-delete-stream-dialog.component";

@Component({
  selector: "app-radio-stream-list",
  templateUrl: "./radio-stream-list.component.html",
  styleUrls: ["./radio-stream-list.component.scss"],
})
export class RadioStreamListComponent implements AfterViewInit {
  @Input() dataSource = new MatTableDataSource<RadioStream>();

  displayedColumns: string[] = [
    "name",
    "url",
    "deleteStream",
    "addStream",
    "playStream",
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

  constructor(
    private radioService: RadioStreamService,
    private queueService: QueueService,
    private dialog: MatDialog,
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onPlayStream(stream: RadioStream): void {
    this.queueService.addPlayTrack(stream.url);
  }

  onAddStream(stream: RadioStream): void {
    this.queueService.addTrack(stream.url);
  }

  onConfirmDeleteStream(stream: RadioStream): void {
    const dialogRef = this.dialog.open(ConfirmDeleteStreamDialogComponent, {
      data: stream.name,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.radioService
          .deleteStream(stream.id)
          .subscribe((data) => (this.dataSource.data = data));
      }
    });
  }

  onAddAll(): void {
    const streams = this.dataSource.data.map((rs) => rs.url);
    this.queueService.addTracks(streams);
  }

  applyFilter(eventTarget: EventTarget | null): void {
    if (!eventTarget) {
      return;
    }
    const filterValue = (eventTarget as HTMLInputElement).value;
    this.dataSource.filter = filterValue.toLowerCase();
  }

  resetFilter(): void {
    this.dataSource.filter = "";
  }
}
