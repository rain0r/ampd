import { Component } from "@angular/core";
import { FrontendSettings } from "../../../shared/models/frontend-settings";
import { NotificationService } from "../../../shared/services/notification.service";
import { SettingsService } from "../../../shared/services/settings.service";

@Component({
  selector: "app-virtual-scroll",
  templateUrl: "./virtual-scroll.component.html",
  styleUrls: ["./virtual-scroll.component.scss"],
})
export class VirtualScrollComponent {
  frontendSettings: FrontendSettings;

  constructor(
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.frontendSettings = settingsService.getFrontendSettings();
  }

  toggle(checked: boolean): void {
    this.settingsService.setVirtualScroll(checked);
    this.notificationService.popUp(
      `${checked ? "Enabled" : "Disabled"} virtual scrolling`
    );
  }
}
