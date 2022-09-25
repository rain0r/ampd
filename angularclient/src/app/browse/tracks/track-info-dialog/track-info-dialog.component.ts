import { KeyValue } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { map, Observable, tap } from "rxjs";
import { LastFmService } from "src/app/service/last-fm.service";
import { Track } from "src/app/shared/messages/incoming/track";
import { ReplaceNullWithTextPipe } from "src/app/shared/pipes/replace-null-with-text.pipe";
import { TagMap } from "../../../shared/messages/incoming/track";
import { CamelCaseTitlePipe } from "../../../shared/pipes/camel-case-title.pipe";

@Component({
  selector: "app-track-info-dialog",
  templateUrl: "./track-info-dialog.component.html",
  styleUrls: ["./track-info-dialog.component.scss"],
})
export class TrackInfoDialogComponent {
  displayedColumns: string[] = ["key", "value"];
  trackSource: KeyValue<string, string>[] = [];
  tagSource: KeyValue<string, string>[] = [];
  similarSource: Observable<KeyValue<string, string>[]> = new Observable();
  lastFmApiKey = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public track: Track,
    private camelCaseTitlePipe: CamelCaseTitlePipe,
    private replaceNullWithTextPipe: ReplaceNullWithTextPipe,
    private lastFmService: LastFmService
  ) {
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
        })
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
