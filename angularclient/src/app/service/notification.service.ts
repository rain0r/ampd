import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  popUp(message: string, isErrorMsg = false): void {
    const duration = isErrorMsg ? 10000 : 2000;
    this.snackBar.open(decodeURIComponent(message), "Close", {
      duration: duration,
    });
  }
}
