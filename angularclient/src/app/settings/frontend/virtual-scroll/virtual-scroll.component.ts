import { Component } from "@angular/core";
import { map, Observable, take } from "rxjs";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { NotificationService } from "../../../service/notification.service";

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
    this.virtualScroll = this.frontendSettingsService.settings$.pipe(
      take(1),
      map((settings) => settings.virtualScroll)
    );
  }

  toggle(checked: boolean): void {
    this.frontendSettingsService.settings$.pipe(take(1)).subscribe((data) => {
      data.virtualScroll = checked;
      this.frontendSettingsService.save(data);
    });
    this.notificationService.popUp(
      `${checked ? "Enabled" : "Disabled"} virtual scrolling`
    );
  }
}
