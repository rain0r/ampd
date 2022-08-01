import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.scss"],
})
export class ErrorDialogComponent {
  isHttp = false;
  status = 0;
  statusText = "";

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public error: HttpErrorResponse | unknown
  ) {
    if (error instanceof HttpErrorResponse) {
      this.isHttp = true;
      this.status = error.status;
      this.statusText = error.statusText;
    }
  }
}
