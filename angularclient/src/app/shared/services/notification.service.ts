import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  popUp(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
    });
  }
}
