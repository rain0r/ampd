import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { QueueTrack } from "../models/queue-track";

@Component({
  selector: "app-cover-modal",
  templateUrl: "./cover-modal.component.html",
  styleUrls: ["./cover-modal.component.scss"],
})
export class CoverModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CoverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueueTrack
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
