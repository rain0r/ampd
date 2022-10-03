import { Component } from "@angular/core";
import { map } from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { NotificationService } from "../../../service/notification.service";
import { BACKEND_ADDR } from "../../../shared/model/internal/frontend-settings";

@Component({
  selector: "app-backend-address",
  templateUrl: "./backend-address.component.html",
  styleUrls: ["./backend-address.component.scss"],
})
export class BackendAddressComponent {
  backendAddr = "";

  constructor(
    private notificationService: NotificationService,
    private frontendSettingsService: FrontendSettingsService
  ) {
    this.frontendSettingsService.settings$
      .pipe(map((settings) => settings.backendAddr))
      .subscribe((addr) => (this.backendAddr = addr));
  }

  onSubmit(): void {
    this.frontendSettingsService.setValue(BACKEND_ADDR, this.backendAddr);
    this.notificationService.popUp("Saved backend address.");
  }
}
