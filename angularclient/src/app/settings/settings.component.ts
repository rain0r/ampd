import { Component } from "@angular/core";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { Title } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { NotificationService } from "../service/notification.service";
import { SettingsService } from "../service/settings.service";
import { AmpdSetting } from "../shared/model/ampd-setting";
import { FrontendSetting } from "../shared/model/internal/frontend-settings";
import { MpdSettings } from "../shared/model/mpd-settings";

interface SettingMap {
  [category: string]: FrontendSetting[];
}

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  mpdSettings: Observable<MpdSettings>;
  ampdSettings: Observable<AmpdSetting[]>;
  feSettings: SettingMap;

  constructor(
    private fsService: FrontendSettingsService,
    private settingsService: SettingsService,
    private titleService: Title,
    private notificationService: NotificationService
  ) {
    this.titleService.setTitle("ampd — Settings");
    this.ampdSettings = this.settingsService.getAmpdSettings();
    this.mpdSettings = this.settingsService.getMpdSettings();
    this.feSettings = this.buildFeSettingCategories();
  }

  toggleFrontendSetting(name: string, event: MatSlideToggleChange): void {
    this.fsService.save(name, event.checked);
  }

  onSaveBtnClick(name: string, value: string): void {
    this.fsService.save(name, value);
    this.notificationService.popUp("Saved settings.");
  }

  resetFrontendSettings(): void {
    this.fsService.reset();
    window.location.reload();
  }

  buildFeSettingCategories(): SettingMap {
    const settingMap = <SettingMap>{};
    const settings = this.fsService.loadFrontendSettings();
    for (const setting of settings) {
      if (!(setting.category in settingMap)) {
        settingMap[setting.category] = [];
      }
      settingMap[setting.category].push(setting);
    }
    return settingMap;
  }
}
