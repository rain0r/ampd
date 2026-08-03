import { AsyncPipe } from "@angular/common";
import {
  Component,
  OnInit,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, map } from "rxjs";
import { BrowseNavigationComponent } from "../navigation/browse-navigation.component";
import { SettingsService } from "./../../service/settings.service";
import { AddStreamComponent } from "./add-radio-stream/add-radio-stream.component";
import { ImportRadioStreamsComponent } from "./import-radio-streams/import-radio-streams.component";
import { RadioStreamListComponent } from "./radio-stream-list/radio-stream-list.component";
import { RadioStreamService } from "../../service/radio-stream.service";
import { RadioStream } from "../../shared/model/db/radio-stream";

@Component({
  selector: "app-radio-streams",
  templateUrl: "./radio-streams.component.html",
  styleUrls: ["./radio-streams.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    BrowseNavigationComponent,
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
