import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";

@Component({
  selector: "app-http-error-dialog",
  templateUrl: "./http-error-dialog.component.html",
  styleUrls: ["./http-error-dialog.component.scss"],
})
export class HttpErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public error: HttpErrorResponse
  ) {}
}
