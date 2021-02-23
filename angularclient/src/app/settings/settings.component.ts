import {Component} from "@angular/core";
import {environment} from "../../environments/environment";

import {NotificationService} from "../shared/services/notification.service";
import {WebSocketService} from "../shared/services/web-socket.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {BackendSettings} from "../shared/models/backend-settings";
import {SettingsService} from "../shared/services/settings.service";
import {DISPLAY_COVERS_KEY, DISPLAY_SAVE_PLAYLIST_KEY,} from "../shared/local-storage-keys";
import {CoverBlacklistFiles} from "../shared/models/cover-blacklist-files";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  ampdVersion = environment.ampdVersion;
  coverCacheUsage = new Observable<number>();
  gitCommitId = environment.gitCommitId;
  isDarkTheme: Observable<boolean>;
  isDisplayCovers: boolean;
  isDisplaySavePlaylist: boolean;
  backendSettings: Observable<BackendSettings>;
  coverBlacklist: Observable<CoverBlacklistFiles>;
  settingsForm: FormGroup;

  constructor(
      private notificationService: NotificationService,
      private webSocketService: WebSocketService,
      private formBuilder: FormBuilder,
      private settingsService: SettingsService
  ) {
    this.settingsForm = this.buildSettingsForm();
    // Backend settings
    this.isDarkTheme = this.settingsService.isDarkTheme();
    this.isDisplayCovers = this.settingsService.getBoolValue(
        DISPLAY_COVERS_KEY,
        true
    );
    this.isDisplaySavePlaylist = this.settingsService.getBoolValue(
        DISPLAY_SAVE_PLAYLIST_KEY,
        true
    );
    // Frontend settings
    this.coverCacheUsage = this.settingsService.getCoverCacheDiskUsage();
    this.backendSettings = this.settingsService.getBackendSettings();
    this.coverBlacklist = this.settingsService.getCoverBlacklist();
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

  toggleDarkTheme(checked: boolean): void {
    this.settingsService.setTheme(checked);
    this.notificationService.popUp("Saved settings.");
  }

  toggleDisplayCovers(checked: boolean): void {
    this.settingsService.setBoolVale(DISPLAY_COVERS_KEY, checked);
    this.notificationService.popUp("Saved settings.");
  }

  toggleDisplaySavePlaylist(checked: boolean): void {
    this.settingsService.setBoolVale(DISPLAY_SAVE_PLAYLIST_KEY, checked);
    this.notificationService.popUp("Saved settings.");
  }

  private getBackendAddr() {
    // Return the saved backend addr
    return this.settingsService.getBackendAddr();
  }

  private buildSettingsForm() {
    return this.formBuilder.group({
      backendAddr: [this.getBackendAddr(), Validators.required],
    });
  }
}
