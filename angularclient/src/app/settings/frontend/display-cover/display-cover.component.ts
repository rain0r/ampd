import { DISPLAY_COVERS } from "./../../../shared/models/internal/frontend-settings";
import { Component } from "@angular/core";
import { map, Observable, take } from "rxjs";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { NotificationService } from "../../../service/notification.service";

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
    this.displayCovers = this.frontendSettingsService.settings$.pipe(
      take(1),
      map((settings) => settings.displayCovers)
    );
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setValue(DISPLAY_COVERS, checked);
    this.notificationService.popUp(
      `${checked ? "Showing" : "Not showing"} album covers.`
    );
  }
}
