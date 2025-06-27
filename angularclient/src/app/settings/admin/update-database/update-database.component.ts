import { Component, inject } from "@angular/core";
import { MpdService } from "../../../service/mpd.service";
import { NotificationService } from "../../../service/notification.service";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-update-database",
  templateUrl: "./update-database.component.html",
  styleUrls: ["./update-database.component.scss"],
  imports: [MatCard, MatCardContent, MatButton],
})
export class UpdateDatabaseComponent {
  private notificationService = inject(NotificationService);
  private mpdService = inject(MpdService);

  rescanDatabase(): void {
    this.mpdService.rescanDatabase$().subscribe(() => {
      this.notificationService.popUp("Triggered database rescan");
    });
  }

  updateDatabase(): void {
    this.mpdService.updateDatabase$().subscribe(() => {
      this.notificationService.popUp("Triggered database update");
    });
  }
}
