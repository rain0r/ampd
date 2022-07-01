import { KeyValue, TitleCasePipe } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Track } from "src/app/shared/messages/incoming/track";
import { ReplaceNullWithTextPipe } from "src/app/shared/pipes/replace-null-with-text.pipe";
import { TagMap } from "./../../../shared/messages/incoming/track";

@Component({
  selector: "app-track-info-modal",
  templateUrl: "./track-info-modal.component.html",
  styleUrls: ["./track-info-modal.component.scss"],
})
export class TrackInfoModalComponent {
  displayedColumns: string[] = ["key", "value"];
  trackSource: KeyValue<string, string>[] = [];
  tagSource: KeyValue<string, string>[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public track: Track,
    private titleCasePipe: TitleCasePipe,
    private replaceNullWithTextPipe: ReplaceNullWithTextPipe
  ) {
    this.trackSource = this.buildTableData(track);
    this.tagSource = this.buildTableData(track.tagMap);
  }

  buildTableData(track: Track | TagMap): KeyValue<string, string>[] {
    const ret: KeyValue<string, string>[] = [];
    Object.keys(track).forEach((key) => {
      if (key === "tagMap") {
        return;
      }
      const keyType = key as keyof typeof track;
      const data = {
        key: this.titleCasePipe.transform(key),
        value: this.replaceNullWithTextPipe.transform(track[keyType]),
      } as KeyValue<string, string>;
      ret.push(data);
    });
    return ret.sort((a, b) => a.key.localeCompare(b.key));
  }
}
