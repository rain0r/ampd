import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-delete-stream-dialog",
  templateUrl: "./confirm-delete-stream-dialog.component.html",
  styleUrl: "./confirm-delete-stream-dialog.component.scss",
})
export class ConfirmDeleteStreamDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public radioStream: string,
    public dialogRef: MatDialogRef<ConfirmDeleteStreamDialogComponent>,
  ) {}

  confirm(): boolean {
    return true;
  }
}
