import { Component } from "@angular/core";
import { map, Observable, take } from "rxjs";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { NotificationService } from "../../../service/notification.service";
import { DARK_THEME } from "./../../../shared/models/internal/frontend-settings";

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
    this.darkTheme = this.frontendSettingsService.settings$.pipe(
      take(1),
      map((settings) => settings.darkTheme)
    );
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setValue(DARK_THEME, checked);
    this.notificationService.popUp(
      `${checked ? "Enabled" : "Disabled"} dark theme.`
    );
  }
}
