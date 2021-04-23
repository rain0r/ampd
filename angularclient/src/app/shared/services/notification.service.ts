import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  popUp(message: string, isErrorMsg = false): void {
    const duration = isErrorMsg ? 10000 : 2000;
    this.snackBar.open(decodeURIComponent(message), "Close", {
      duration: duration,
    });
  }
}
