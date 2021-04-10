import { Component } from "@angular/core";
import { FrontendSettings } from "../../../shared/models/frontend-settings";
import { NotificationService } from "../../../shared/services/notification.service";
import { SettingsService } from "../../../shared/services/settings.service";

@Component({
  selector: "app-tab-title",
  templateUrl: "./tab-title.component.html",
  styleUrls: ["./tab-title.component.scss"],
})
export class TabTitleComponent {
  frontendSettings: FrontendSettings;

  constructor(
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.frontendSettings = settingsService.getFrontendSettings();
  }

  toggle(checked: boolean): void {
    this.settingsService.setTabTitleOption(checked);
    this.notificationService.popUp(
      `${
        checked ? "Setting" : "Not setting"
      } current playing track as tab title.`
    );
  }
}
