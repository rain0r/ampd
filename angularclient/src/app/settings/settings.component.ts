import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { SettingsService } from "../service/settings.service";
import { AmpdSetting } from "../shared/model/ampd-setting";
import { MpdSettings } from "../shared/model/mpd-settings";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  mpdSettings: Observable<MpdSettings>;
  ampdSettings: Observable<AmpdSetting[]>;

  constructor(
    private settingsService: SettingsService,
    private titleService: Title
  ) {
    this.titleService.setTitle("ampd — Settings");
    this.ampdSettings = this.settingsService.getAmpdSettings();
    this.mpdSettings = this.settingsService.getMpdSettings();
  }
}
