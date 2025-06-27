import { SettingsService } from "./../../service/settings.service";
import { Component, OnInit, inject } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, map } from "rxjs";
import { RadioStreamService } from "src/app/service/radio-stream.service";
import { RadioStream } from "src/app/shared/model/db/radio-stream";
import { BrowseNavigationComponent } from "../navigation/browse-navigation.component";
import { NgIf, AsyncPipe } from "@angular/common";
import { RadioStreamListComponent } from "./radio-stream-list/radio-stream-list.component";
import { MatDivider } from "@angular/material/divider";
import { AddStreamComponent } from "./add-radio-stream/add-radio-stream.component";
import { ImportRadioStreamsComponent } from "./import-radio-streams/import-radio-streams.component";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-radio-streams",
  templateUrl: "./radio-streams.component.html",
  styleUrls: ["./radio-streams.component.scss"],
  imports: [
    BrowseNavigationComponent,
    NgIf,
    RadioStreamListComponent,
    MatDivider,
    AddStreamComponent,
    ImportRadioStreamsComponent,
    MatButton,
    AsyncPipe,
  ],
})
export class RadioStreamsComponent implements OnInit {
  private radioStreamService = inject(RadioStreamService);
  private settingsService = inject(SettingsService);

  dataSource$ = new Observable<MatTableDataSource<RadioStream>>();
  exportRadioStreamsUrls: string;

  constructor() {
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
