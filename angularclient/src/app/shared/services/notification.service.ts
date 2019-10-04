import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  public popUp(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
    });
  }
}
