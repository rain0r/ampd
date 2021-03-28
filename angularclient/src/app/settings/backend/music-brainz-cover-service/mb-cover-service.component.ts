import {Component, Input} from "@angular/core";
import {Observable} from "rxjs";
import {SettingsService} from "../../../shared/services/settings.service";
import {map} from "rxjs/operators";

@Component({
  selector: "app-music-brainz-cover-service",
  templateUrl: "./mb-cover-service.component.html",
  styleUrls: ["./mb-cover-service.component.scss"],
})
export class MbCoverServiceComponent {
  @Input() mbCoverService = false;
  blacklistedCovers: Observable<number> = new Observable<number>();
  coverCacheUsage = new Observable<number>();

  constructor(private settingsService: SettingsService) {
    this.coverCacheUsage = this.settingsService.getCoverCacheDiskUsage();
    this.blacklistedCovers = this.settingsService.getCoverBlacklist().pipe(
        map((foo) => foo.blacklistedFiles.length)
    );
  }
}
