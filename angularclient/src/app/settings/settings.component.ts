import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { BackendSettings } from "../shared/models/backend-settings";
import { SettingsService } from "../service/settings.service";
import { Title } from "@angular/platform-browser";
import { ErrorMsg } from "../shared/error/error-msg";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  backendSettings: Observable<BackendSettings>;
  error: ErrorMsg | null = null;

  constructor(
    private settingsService: SettingsService,
    private titleService: Title
  ) {
    this.titleService.setTitle("ampd — Settings");
    // Backend stuff
    this.backendSettings = this.settingsService.getBackendSettings();
    this.backendSettings.subscribe({
      error: (error: ErrorMsg) => {
        this.error = error;
      },
    });
  }
}
