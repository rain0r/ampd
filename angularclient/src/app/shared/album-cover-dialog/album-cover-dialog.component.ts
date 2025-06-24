import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { NgIf } from "@angular/common";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-album-cover-dialog",
  templateUrl: "./album-cover-dialog.component.html",
  styleUrls: ["./album-cover-dialog.component.scss"],
  imports: [NgIf, MatDialogActions, MatButton, MatDialogClose],
})
export class AlbumCoverDialogComponent {
  coverUrl = inject(MAT_DIALOG_DATA);
}
