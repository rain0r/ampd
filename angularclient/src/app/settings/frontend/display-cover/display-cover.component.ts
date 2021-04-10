import { Component } from "@angular/core";
import { NotificationService } from "../../../shared/services/notification.service";
import { SettingsService } from "../../../shared/services/settings.service";
import { FrontendSettings } from "../../../shared/models/frontend-settings";

@Component({
  selector: "app-display-cover",
  templateUrl: "./display-cover.component.html",
  styleUrls: ["./display-cover.component.scss"],
})
export class DisplayCoverComponent {
  frontendSettings: FrontendSettings;

  constructor(
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.frontendSettings = settingsService.getFrontendSettings();
  }

  toggle(checked: boolean): void {
    this.settingsService.setDisplayCovers(checked);
    this.notificationService.popUp(
      `${checked ? "Showing" : "Not showing"} album covers.`
    );
  }
}
