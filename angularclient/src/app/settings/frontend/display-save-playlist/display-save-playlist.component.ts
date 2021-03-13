import { Component } from "@angular/core";
import { FrontendSettings } from "../../../shared/models/frontend-settings";
import { NotificationService } from "../../../shared/services/notification.service";
import { SettingsService } from "../../../shared/services/settings.service";

@Component({
  selector: "app-display-save-playlist",
  templateUrl: "./display-save-playlist.component.html",
  styleUrls: ["./display-save-playlist.component.scss"],
})
export class DisplaySavePlaylistComponent {
  frontendSettings: FrontendSettings;

  constructor(
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.frontendSettings = settingsService.getFrontendSettings();
  }

  toggle(checked: boolean): void {
    this.settingsService.setDisplaySavePlaylist(checked);
    this.notificationService.popUp("Saved settings.");
  }
}