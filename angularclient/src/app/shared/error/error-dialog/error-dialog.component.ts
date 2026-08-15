import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
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

@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDivider,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
})
export class ErrorDialogComponent {
  dialogRef = inject<MatDialogRef<ErrorDialogComponent>>(MatDialogRef);
  error = inject(MAT_DIALOG_DATA);
}
