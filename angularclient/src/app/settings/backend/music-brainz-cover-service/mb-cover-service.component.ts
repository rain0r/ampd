import { Component, Input } from "@angular/core";
import { Observable } from "rxjs";
import { SettingsService } from "../../../service/settings.service";

@Component({
  selector: "app-music-brainz-cover-service",
  templateUrl: "./mb-cover-service.component.html",
  styleUrls: ["./mb-cover-service.component.scss"],
})
export class MbCoverServiceComponent {
  @Input() mbCoverService = false;
  coverCacheUsage = new Observable<number>();

  constructor(private settingsService: SettingsService) {
    this.coverCacheUsage = this.settingsService.getCoverCacheDiskUsage();
  }
}
