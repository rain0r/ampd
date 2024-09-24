import { SettingsService } from "./../../service/settings.service";
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
  exportRadioStreamsUrls: string;

  constructor(
    private radioStreamService: RadioStreamService,
    private settingsService: SettingsService,
  ) {
    this.exportRadioStreamsUrls = `${this.settingsService.getBackendContextAddr()}api/radio-streams`;
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.dataSource$ = this.radioStreamService
      .getRadioStreams()
      .pipe(map((data) => new MatTableDataSource<RadioStream>(data)));
  }
}
