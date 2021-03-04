import { Component } from "@angular/core";

import { NotificationService } from "../shared/services/notification.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { BackendSettings } from "../shared/models/backend-settings";
import { SettingsService } from "../shared/services/settings.service";
import { CoverBlacklistFiles } from "../shared/models/cover-blacklist-files";
import { FrontendSettings } from "../shared/models/frontend-settings";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  backendSettings: Observable<BackendSettings>;
  coverBlacklist: Observable<CoverBlacklistFiles>;
  coverCacheUsage = new Observable<number>();
  frontendSettings: FrontendSettings;
  settingsForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private titleService: Title
  ) {
    this.titleService.setTitle("ampd — Settings");
    this.settingsForm = this.buildSettingsForm();
    // Backend stuff
    this.coverCacheUsage = this.settingsService.getCoverCacheDiskUsage();
    this.backendSettings = this.settingsService.getBackendSettings();
    this.coverBlacklist = this.settingsService.getCoverBlacklist();
    // Frontend stuff
    this.frontendSettings = this.settingsService.getFrontendSettings();
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.notificationService.popUp("Invalid input.");
      return;
    }
    this.settingsService.setBackendAddr(
      this.settingsForm.controls.backendAddr.value
    );
    this.notificationService.popUp("Saved settings.");
  }

  private getBackendAddr(): string {
    // Return the saved backend addr
    return this.settingsService.getBackendContextAddr();
  }

  private buildSettingsForm(): FormGroup {
    return this.formBuilder.group({
      backendAddr: [this.getBackendAddr(), Validators.required],
    });
  }
}
