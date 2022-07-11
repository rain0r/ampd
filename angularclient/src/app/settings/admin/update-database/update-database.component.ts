import { Component } from "@angular/core";
import { NotificationService } from "../../../service/notification.service";
import { MpdService } from "../../../service/mpd.service";

@Component({
  selector: "app-update-database",
  templateUrl: "./update-database.component.html",
  styleUrls: ["./update-database.component.scss"],
})
export class UpdateDatabaseComponent {
  constructor(
    private notificationService: NotificationService,
    private mpdService: MpdService
  ) {}

  rescanDatabase(): void {
    this.mpdService.rescanDatabase().subscribe(() => {
      this.notificationService.popUp("Triggered database rescan");
    });
  }

  updateDatabase(): void {
    this.mpdService.updateDatabase().subscribe(() => {
      this.notificationService.popUp("Triggered database update");
    });
  }
}
