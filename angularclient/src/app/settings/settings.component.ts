import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { SettingsService } from "../service/settings.service";
import { ErrorMsg } from "../shared/error/error-msg";
import { BackendSettings } from "../shared/models/backend-settings";
import { NewBackendSettings } from "../shared/models/new-backend-settings";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  backendSettings: Observable<BackendSettings>;
  newBackendSettings: Observable<NewBackendSettings[]>;
  error: ErrorMsg | null = null;

  constructor(
    private settingsService: SettingsService,
    private titleService: Title
  ) {
    this.titleService.setTitle("ampd — Settings");

    this.newBackendSettings = this.settingsService.getNewBackendSettings();

    this.backendSettings = this.settingsService.getBackendSettings();
    this.backendSettings.subscribe({
      error: (error: ErrorMsg) => {
        this.error = error;
      },
    });
  }
}
