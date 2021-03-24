import { Component } from "@angular/core";
import { SettingsService } from "../../../shared/services/settings.service";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-update-database",
  templateUrl: "./update-database.component.html",
  styleUrls: ["./update-database.component.scss"],
})
export class UpdateDatabaseComponent {
  constructor(
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {}

  updateDatabase(): void {
    this.settingsService.updateDatabase().subscribe(() => {
      this.notificationService.popUp("Triggered database update");
    });
  }
}
