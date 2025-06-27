import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, NgZone, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, first } from "rxjs";
import { ErrorDialogComponent } from "./error/error-dialog/error-dialog.component";

@Injectable()
export class AmpdErrorHandler implements ErrorHandler {
  private dialog = inject(MatDialog);
  private zone = inject(NgZone);

  private errorDialogOpen = new BehaviorSubject(false);

  handleError(error: unknown): void {
    this.zone.run(() => {
      console.error("Error from global error handler", error);
      this.openErrorDialog(error);
    });
  }

  private openErrorDialog(error: unknown) {
    this.errorDialogOpen
      .asObservable()
      .pipe(first())
      .subscribe((open) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            // Ignore 404 errors coming from find-cover
            return;
          }
        }

        if (!open) {
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            width: "80%",
            data: error,
          });
          this.errorDialogOpen.next(true);
          dialogRef
            .afterClosed()
            .subscribe(() => this.errorDialogOpen.next(false));
        }
      });
  }
}
