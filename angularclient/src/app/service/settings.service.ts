import { Location } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiEndpoints } from "../shared/api-endpoints";
import { ErrorMsg } from "../shared/error/error-msg";
import { KEY_BACKEND_ADDRESS } from "../shared/local-storage-keys";
import { MpdSettings } from "../shared/models/mpd-settings";
import { CoverDiskUsage } from "../shared/models/http/cover-disk-usage";
import { AmpdSetting } from "../shared/models/ampd-setting";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(private http: HttpClient, private location: Location) {}

  setBackendAddr(backendAddr: string): void {
    localStorage.setItem(KEY_BACKEND_ADDRESS, backendAddr);
  }

  getAmpdSettings(): Observable<AmpdSetting[]> {
    const url = `${this.getBackendContextAddr()}api/backend`;
    return this.http.get<AmpdSetting[]>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError(() => {
          return {
            title: `Got an error retrieving the backend settings:`,
            detail: err.message,
          } as ErrorMsg;
        })
      )
    );
  }

  getMpdSettings(): Observable<MpdSettings> {
    const url = `${this.getBackendContextAddr()}api/settings`;
    return this.http.get<MpdSettings>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError(() => {
          return {
            title: `Got an error retrieving the backend settings:`,
            detail: err.message,
          } as ErrorMsg;
        })
      )
    );
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
    return `${ApiEndpoints.getBackendAddr()}${this.location.prepareExternalUrl(
      ""
    )}`;
  }

  getPlaylistRootUrl(): string {
    return `${this.getBackendContextAddr()}api/playlists/`;
  }
}
