import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { environment } from "src/environments/environment";
import { AmpdSetting } from "../shared/model/ampd-setting";
import { CoverDiskUsage } from "../shared/model/http/cover-disk-usage";
import { MpdSettings } from "../shared/model/mpd-settings";
import { BACKEND_ADDR } from "../shared/model/internal/frontend-settings";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(
    private http: HttpClient,
    private location: Location,
    private frontendSettingsService: FrontendSettingsService
  ) {}

  getAmpdSettings(): Observable<AmpdSetting[]> {
    const url = `${this.getBackendContextAddr()}api/backend`;
    return this.http.get<AmpdSetting[]>(url);
  }

  getMpdSettings(): Observable<MpdSettings> {
    const url = `${this.getBackendContextAddr()}api/settings`;
    return this.http.get<MpdSettings>(url);
  }

  getCoverCacheDiskUsage(): Observable<number> {
    const url = `${this.getBackendContextAddr()}api/cover-disk-usage`;
    return this.http
      .get<CoverDiskUsage>(url)
      .pipe(map((usage) => usage.coverDiskUsage));
  }

  /**
   * Returns the api endpoint of the backend that looks for covers in a directory specified by
   * a directory path.
   */
  getFindDirCoverUrl(): string {
    return `${this.getBackendContextAddr()}api/find-dir-cover`;
  }

  /**
   * Returns the API-base URL respecting a potential context. For example, if the base href is set to 'ampd' it will
   * return 'example.com/ampd'.
   */
  getBackendContextAddr(): string {
    return `${this.getBackendAddr()}${this.location.prepareExternalUrl("")}`;
  }

  getPlaylistRootUrl(): string {
    return `${this.getBackendContextAddr()}api/playlists/`;
  }

  /**
   * Returns the base backend address, not taking a potential context into account.
   * In development mode we're running on http://localhost:4200 which can't be used as a backend address.
   * If the user somehow decided to change the backend address to a different value, we return this value from
   * localStorage.
   */
  getBackendAddr(): string {
    let backendAddr: string;
    if (environment.production) {
      let backendAddr =
        this.frontendSettingsService.loadFrontendSettings().backendAddr;
      if (backendAddr === "") {
        backendAddr = window.location.origin;
        this.frontendSettingsService.setValue(
          BACKEND_ADDR,
          window.location.origin
        );
      }
      return backendAddr;
    } else {
      backendAddr = environment.backendAddr;
    }
    if (backendAddr.endsWith("/")) {
      // Remove trailing slash to prevent a wrong websocket address
      backendAddr = backendAddr.substring(0, backendAddr.length - 1);
    }
    return backendAddr;
  }
}
