import { Component } from "@angular/core";
import { NotificationService } from "../../../service/notification.service";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-theme",
  templateUrl: "./theme.component.html",
  styleUrls: ["./theme.component.scss"],
})
export class ThemeComponent {
  darkTheme: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private notificationService: NotificationService
  ) {
    this.darkTheme = frontendSettingsService.darkTheme;
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setDarkTheme(checked);
    this.notificationService.popUp(
      `${checked ? "Enabled" : "Disabled"} dark theme.`
    );
  }
}
