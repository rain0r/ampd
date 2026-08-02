import { HttpErrorResponse } from "@angular/common/http";
import {
  DestroyRef,
  ErrorHandler,
  Injectable,
  NgZone,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, first } from "rxjs";
import { ErrorDialogComponent } from "./error/error-dialog/error-dialog.component";

@Injectable()
export class AmpdErrorHandler implements ErrorHandler {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
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
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
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
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.errorDialogOpen.next(false));
        }
      });
  }
}
