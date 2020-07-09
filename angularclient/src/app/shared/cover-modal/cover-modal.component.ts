import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-cover-modal",
  templateUrl: "./cover-modal.component.html",
  styleUrls: ["./cover-modal.component.scss"],
})
export class CoverModalComponent {
  constructor(
    public dialogRef: MatDialogRef<CoverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
