import { Component } from "@angular/core";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { NotificationService } from "../../../service/notification.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.scss"],
})
export class PaginationComponent {
  pagination: Observable<boolean>;
  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private notificationService: NotificationService
  ) {
    this.pagination = frontendSettingsService.pagination;
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setPagination(checked);
    this.notificationService.popUp(
      `${
        checked ? "Setting" : "Not setting"
      } current playing track as tab title.`
    );
  }
}
