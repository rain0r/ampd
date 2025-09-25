import { KeyValue, AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { map, Observable, tap } from "rxjs";
import { LastFmService } from "src/app/service/last-fm.service";
import { Track } from "src/app/shared/messages/incoming/track";
import { ReplaceNullWithTextPipe } from "src/app/shared/pipes/replace-null-with-text.pipe";
import { TagMap } from "../../../shared/messages/incoming/track";
import { CamelCaseTitlePipe } from "../../../shared/pipes/camel-case-title.pipe";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { KeyValueTableComponent } from "../../../shared/key-value-table/key-value-table.component";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-track-info-dialog",
  templateUrl: "./track-info-dialog.component.html",
  styleUrls: ["./track-info-dialog.component.scss"],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatTabGroup,
    MatTab,
    KeyValueTableComponent,
    MatProgressSpinner,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    AsyncPipe,
  ],
})
export class TrackInfoDialogComponent {
  track = inject<Track>(MAT_DIALOG_DATA);
  private camelCaseTitlePipe = inject(CamelCaseTitlePipe);
  private replaceNullWithTextPipe = inject(ReplaceNullWithTextPipe);
  private lastFmService = inject(LastFmService);

  displayedColumns: string[] = ["key", "value"];
  trackSource: KeyValue<string, string>[] = [];
  tagSource: KeyValue<string, string>[] = [];
  similarSource = new Observable<KeyValue<string, string>[]>();
  lastFmApiKey = "";

  constructor() {
    const track = this.track;

    this.trackSource = this.buildTableData(track);
    this.tagSource = this.buildTableData(track.tagMap);
    this.similarSource = this.buildSimilarTracks(track);
  }
  buildSimilarTracks(track: Track): Observable<KeyValue<string, string>[]> {
    return this.lastFmService
      .getSimilarTracks(track.artistName, track.title)
      .pipe(
        tap((ret) => (this.lastFmApiKey = ret.apiKey)),
        map((st) => st.similarTracks),
        map((tracks) => {
          const ret: KeyValue<string, string>[] = [];
          tracks.map((innerTrack) => {
            const data = {
              key: innerTrack.artist,
              value: innerTrack.name,
            } as KeyValue<string, string>;
            ret.push(data);
          });
          return ret;
        }),
      );
  }

  buildTableData(track: Track | TagMap): KeyValue<string, string>[] {
    const ret: KeyValue<string, string>[] = [];
    Object.keys(track).forEach((key) => {
      if (key === "tagMap") {
        return;
      }
      const keyType = key as keyof typeof track;
      const data = {
        key: this.camelCaseTitlePipe.transform(key),
        value: this.replaceNullWithTextPipe.transform(track[keyType]),
      } as KeyValue<string, string>;
      ret.push(data);
    });
    return ret.sort((a, b) => a.key.localeCompare(b.key));
  }
}
