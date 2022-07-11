import { Component } from "@angular/core";
import { NotificationService } from "../../../service/notification.service";
import { Observable } from "rxjs";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";

@Component({
  selector: "app-tab-title",
  templateUrl: "./tab-title.component.html",
  styleUrls: ["./tab-title.component.scss"],
})
export class TabTitleComponent {
  setTabTitle: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private notificationService: NotificationService
  ) {
    this.setTabTitle = frontendSettingsService.setTabTitle;
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setTabTitleOption(checked);
    this.notificationService.popUp(
      `${
        checked ? "Setting" : "Not setting"
      } current playing track as tab title.`
    );
  }
}
