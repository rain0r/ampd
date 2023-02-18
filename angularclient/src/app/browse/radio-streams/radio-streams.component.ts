import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, map } from "rxjs";
import { RadioStreamService } from "src/app/service/radio-stream.service";
import { RadioStream } from "src/app/shared/model/db/radio-stream";

@Component({
  selector: "app-radio-streams",
  templateUrl: "./radio-streams.component.html",
  styleUrls: ["./radio-streams.component.scss"],
})
export class RadioStreamsComponent implements OnInit {
  dataSource$ = new Observable<MatTableDataSource<RadioStream>>();

  constructor(private radioService: RadioStreamService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dataSource$ = this.radioService
      .getRadioStreams()
      .pipe(map((data) => new MatTableDataSource<RadioStream>(data)));
  }
}
