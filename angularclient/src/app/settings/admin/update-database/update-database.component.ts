import {
  Component,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MpdService } from "../../../service/mpd.service";
import { NotificationService } from "../../../service/notification.service";

@Component({
  selector: "app-update-database",
  templateUrl: "./update-database.component.html",
  styleUrls: ["./update-database.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCard, MatCardContent, MatButton],
})
export class UpdateDatabaseComponent {
  private destroyRef = inject(DestroyRef);
  private mpdService = inject(MpdService);
  private notificationService = inject(NotificationService);

  rescanDatabase(): void {
    this.mpdService
      .rescanDatabase$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notificationService.popUp("Triggered database rescan");
      });
  }

  updateDatabase(): void {
    this.mpdService
      .updateDatabase$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notificationService.popUp("Triggered database update");
      });
  }
}
