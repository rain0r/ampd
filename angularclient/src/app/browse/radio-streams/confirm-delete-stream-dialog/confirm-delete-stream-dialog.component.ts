import { Component, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-confirm-delete-stream-dialog",
  templateUrl: "./confirm-delete-stream-dialog.component.html",
  styleUrl: "./confirm-delete-stream-dialog.component.scss",
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class ConfirmDeleteStreamDialogComponent {
  radioStream = inject(MAT_DIALOG_DATA);
  dialogRef =
    inject<MatDialogRef<ConfirmDeleteStreamDialogComponent>>(MatDialogRef);

  confirm(): boolean {
    return true;
  }
}
