import { Component } from "@angular/core";
import { NotificationService } from "../../../shared/services/notification.service";
import { Observable } from "rxjs";
import { FrontendSettingsService } from "../../../shared/services/frontend-settings.service";

@Component({
  selector: "app-virtual-scroll",
  templateUrl: "./virtual-scroll.component.html",
  styleUrls: ["./virtual-scroll.component.scss"],
})
export class VirtualScrollComponent {
  virtualScroll: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private notificationService: NotificationService
  ) {
    this.virtualScroll = frontendSettingsService.virtualScroll;
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.setVirtualScroll(checked);
    this.notificationService.popUp(
      `${checked ? "Enabled" : "Disabled"} virtual scrolling`
    );
  }
}
