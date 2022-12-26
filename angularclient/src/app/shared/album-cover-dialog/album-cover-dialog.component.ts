import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-album-cover-dialog",
  templateUrl: "./album-cover-dialog.component.html",
  styleUrls: ["./album-cover-dialog.component.scss"],
})
export class AlbumCoverDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public coverUrl: string) {}
}
