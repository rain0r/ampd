import { Component } from "@angular/core";
import { NotificationService } from "../../../service/notification.service";
import { SettingsService } from "../../../service/settings.service";

@Component({
  selector: "app-backend-address",
  templateUrl: "./backend-address.component.html",
  styleUrls: ["./backend-address.component.scss"],
})
export class BackendAddressComponent {
  addr: string;

  constructor(
    private notificationService: NotificationService,
    private settingsService: SettingsService
  ) {
    this.addr = this.settingsService.getBackendContextAddr();
  }

  onSubmit(): void {
    this.settingsService.setBackendAddr(this.addr);
    this.notificationService.popUp("Saved backend address.");
  }
}
