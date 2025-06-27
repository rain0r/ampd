import { Component, inject } from "@angular/core";
import {
  MatSlideToggleChange,
  MatSlideToggle,
} from "@angular/material/slide-toggle";
import { Title } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { NotificationService } from "../service/notification.service";
import { SettingsService } from "../service/settings.service";
import { LS_LOG_NAME } from "../shared/log/log-local-storage";
import { AmpdSetting } from "../shared/model/ampd-setting";
import {
  FrontendSetting,
  SettingKeys,
} from "../shared/model/internal/frontend-settings";
import { MpdSettings } from "../shared/model/mpd-settings";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardActions,
  MatCardFooter,
} from "@angular/material/card";
import {
  NgFor,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgIf,
  AsyncPipe,
  KeyValuePipe,
} from "@angular/common";
import { MatLabel, MatFormField, MatHint } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { UpdateDatabaseComponent } from "./admin/update-database/update-database.component";
import { ServerStatisticsComponent } from "./admin/server-statistics/server-statistics.component";
import { LogViewComponent } from "./log-view/log-view.component";

type SettingMap = Record<string, FrontendSetting[]>;

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
  imports: [
    MatTabGroup,
    MatTab,
    MatCard,
    MatCardContent,
    NgFor,
    MatCardHeader,
    MatCardTitle,
    NgSwitch,
    NgSwitchCase,
    MatSlideToggle,
    MatLabel,
    MatFormField,
    MatInput,
    MatCardActions,
    MatButton,
    NgSwitchDefault,
    NgIf,
    MatHint,
    MatCardFooter,
    UpdateDatabaseComponent,
    ServerStatisticsComponent,
    LogViewComponent,
    AsyncPipe,
    KeyValuePipe,
  ],
})
export class SettingsComponent {
  private fsService = inject(FrontendSettingsService);
  private settingsService = inject(SettingsService);
  private titleService = inject(Title);
  private notificationService = inject(NotificationService);

  mpdSettings: Observable<MpdSettings>;
  ampdSettings: Observable<AmpdSetting[]>;
  feSettings: SettingMap;
  displayLog = false;

  constructor() {
    this.titleService.setTitle("ampd — Settings");
    this.ampdSettings = this.settingsService.getAmpdSettings();
    this.mpdSettings = this.settingsService.getMpdSettings();
    this.feSettings = this.buildFeSettingCategories();
    this.displayLog =
      (JSON.parse(localStorage.getItem(LS_LOG_NAME) || "[]") || []).length > 0;
  }

  toggleFrontendSetting(name: SettingKeys, event: MatSlideToggleChange): void {
    this.fsService.save(name, event.checked);
  }

  onSaveBtnClick(name: SettingKeys, value: string): void {
    this.fsService.save(name, value);
    this.notificationService.popUp("Saved settings.");
  }

  resetFrontendSettings(): void {
    this.fsService.reset();
    window.location.reload();
  }

  buildFeSettingCategories(): SettingMap {
    const settingMap = {} as SettingMap;
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
