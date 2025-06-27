import { Component, inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from "@angular/material/dialog";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatDivider } from "@angular/material/divider";
import { MatButton } from "@angular/material/button";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.scss"],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDivider,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    JsonPipe,
  ],
})
export class ErrorDialogComponent {
  dialogRef = inject<MatDialogRef<ErrorDialogComponent>>(MatDialogRef);
  error = inject(MAT_DIALOG_DATA);
}
