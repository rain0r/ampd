import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { CoverBlacklistFiles } from "../../../shared/models/cover-blacklist-files";
import { SettingsService } from "../../../shared/services/settings.service";

@Component({
  selector: "app-cover-blacklist",
  templateUrl: "./cover-blacklist.component.html",
  styleUrls: ["./cover-blacklist.component.scss"],
})
export class CoverBlacklistComponent {
  @Input() mbCoverService = false;
  coverBlacklist: Observable<CoverBlacklistFiles>;

  constructor(private settingsService: SettingsService) {
    this.coverBlacklist = this.settingsService.getCoverBlacklist();
  }
}
