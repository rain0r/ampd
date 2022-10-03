import { UPDATE_TAB_TITLE } from "../../../shared/model/internal/frontend-settings";
import { Component } from "@angular/core";
import { map, Observable, take } from "rxjs";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { NotificationService } from "../../../service/notification.service";

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
    this.setTabTitle = this.frontendSettingsService.settings$.pipe(
      take(1),
      map((settings) => settings.updateTabTitle)
    );
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setValue(UPDATE_TAB_TITLE, checked);
    this.notificationService.popUp(
      `${
        checked ? "Setting" : "Not setting"
      } current playing track as tab title.`
    );
  }
}
