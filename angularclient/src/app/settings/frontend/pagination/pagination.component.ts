import { Component } from "@angular/core";
import { map, Observable, take } from "rxjs";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { NotificationService } from "../../../service/notification.service";
import { PAGINATION } from "../../../shared/model/internal/frontend-settings";

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
    this.pagination = this.frontendSettingsService.settings$.pipe(
      take(1),
      map((settings) => settings.pagination)
    );
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setValue(PAGINATION, checked);
    this.notificationService.popUp(
      `${checked ? "Enabling" : "Disabling"} pagination.`
    );
  }
}
