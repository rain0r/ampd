import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { FrontendSettingsService } from "../service/frontend-settings.service";
import { ErrorDialogComponent } from "./error-dialog/error-dialog.component";

@Injectable()
export class AmpdErrorHandler implements ErrorHandler {
  private errorModalOpen = new BehaviorSubject(false);

  constructor(
    private dialog: MatDialog,
    private frontendSettingsService: FrontendSettingsService,
    private zone: NgZone
  ) {}

  handleError(error: unknown): void {
    this.zone.run(() => {
      console.error("Error from global error handler", error);

      if (!this.errorModalOpen.value) {
        this.errorModalOpen.next(true);

        const dialogRef = this.dialog.open(ErrorDialogComponent, {
          panelClass: this.frontendSettingsService.darkTheme$.value
            ? "dark-theme"
            : "",
          data: error,
        });
        dialogRef
          .afterClosed()
          .subscribe(() => this.errorModalOpen.next(false));
      }
    });
  }
}
