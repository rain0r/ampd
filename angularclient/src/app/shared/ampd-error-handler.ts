import { FrontendSettingsService } from "../service/frontend-settings.service";
import { ErrorDialogComponent } from "./error-dialog/error-dialog.component";
import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Injectable()
export class AmpdErrorHandler implements ErrorHandler {
  constructor(
    private dialog: MatDialog,
    private frontendSettingsService: FrontendSettingsService,
    private zone: NgZone
  ) {}

  handleError(error: unknown): void {
    this.zone.run(() => {
      console.error("Error from global error handler", error);
      //   this.errorDialogService.openDialog(
      //     error?.message || 'Undefined client error',
      //     error?.status
      //   )

      this.dialog.open(ErrorDialogComponent, {
        panelClass: this.frontendSettingsService.darkTheme$.value
          ? "dark-theme"
          : "",
        data: error,
      });
    });
  }
}
