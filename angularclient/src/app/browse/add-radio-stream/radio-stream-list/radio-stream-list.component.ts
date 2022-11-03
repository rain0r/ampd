import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { QueueService } from "src/app/service/queue.service";
import { RadioStreamService } from "src/app/service/radio-stream.service";
import { RadioStream } from "../../../shared/model/db/radio-stream";

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

  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  constructor(
    private radioService: RadioStreamService,
    private queueService: QueueService
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

  onDeleteStream(stream: RadioStream): void {
    this.radioService
      .deleteStream(stream.id)
      .subscribe((data) => (this.dataSource.data = data));
  }

  onAddAll(): void {
    const streams = this.dataSource.data.map((rs) => rs.url);
    console.log("streams", streams);
    this.queueService.addTracks(streams);
  }
}
