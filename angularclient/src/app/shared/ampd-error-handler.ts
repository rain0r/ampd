import { ComponentType } from "@angular/cdk/portal";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { ErrorDialogComponent } from "./error/error-dialog/error-dialog.component";
import { HttpErrorDialogComponent } from "./error/http-error-dialog/http-error-dialog.component";

@Injectable()
export class AmpdErrorHandler implements ErrorHandler {
  private errorModalOpen = new BehaviorSubject(false);

  constructor(private dialog: MatDialog, private zone: NgZone) {}

  handleError(error: unknown): void {
    this.zone.run(() => {
      console.error("Error from global error handler", error);
      this.openErrorDialog(error);
    });
  }

  private openErrorDialog(error: unknown) {
    this.errorModalOpen.asObservable().subscribe((open) => {
      if (!open) {
        let clazz: ComponentType<unknown>;
        if (error instanceof HttpErrorResponse) {
          clazz = HttpErrorDialogComponent;
        } else {
          clazz = ErrorDialogComponent;
        }

        const dialogRef = this.dialog.open(clazz, {
          width: "70%",
          data: error,
        });

        this.errorModalOpen.next(true);
        dialogRef
          .afterClosed()
          .subscribe(() => this.errorModalOpen.next(false));
      }
    });
  }
}
