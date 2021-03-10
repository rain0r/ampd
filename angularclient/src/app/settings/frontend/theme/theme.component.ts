import { Component } from "@angular/core";
import { NotificationService } from "../../../shared/services/notification.service";
import { SettingsService } from "../../../shared/services/settings.service";
import { FrontendSettings } from "../../../shared/models/frontend-settings";

@Component({
  selector: "app-theme",
  templateUrl: "./theme.component.html",
  styleUrls: ["./theme.component.scss"],
})
export class ThemeComponent {
  frontendSettings: FrontendSettings;

  constructor(
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.frontendSettings = settingsService.getFrontendSettings();
  }

  toggle(checked: boolean): void {
    this.settingsService.setDarkTheme(checked);
    this.notificationService.popUp("Saved settings.");
  }
}
