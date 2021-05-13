import { Component } from "@angular/core";
import { NotificationService } from "../../../shared/services/notification.service";
import { FrontendSettingsService } from "../../../shared/services/frontend-settings.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-display-cover",
  templateUrl: "./display-cover.component.html",
  styleUrls: ["./display-cover.component.scss"],
})
export class DisplayCoverComponent {
  displayCovers: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private notificationService: NotificationService
  ) {
    this.displayCovers = frontendSettingsService.displayCovers;
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setDisplayCovers(checked);
    this.notificationService.popUp(
      `${checked ? "Showing" : "Not showing"} album covers.`
    );
  }
}
