import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { BackendSettings } from "../models/backend-settings";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiEndpoints } from "../api-endpoints";
import { KEY_BACKEND_ADDRESS } from "../local-storage-keys";
import { CoverBlacklistFiles } from "../models/cover-blacklist-files";
import { Location } from "@angular/common";
import { catchError } from "rxjs/operators";
import { ErrorMsg } from "../error/error-msg";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(private http: HttpClient, private location: Location) {}

  blacklistCover(file: string): Observable<void> {
    const url = `${this.getBackendContextAddr()}api/blacklist-cover`;
    return this.http.post<void>(url, file);
  }

  setBackendAddr(backendAddr: string): void {
    localStorage.setItem(KEY_BACKEND_ADDRESS, backendAddr);
  }

  /*
   * Getter
   */

  getBackendSettings(): Observable<BackendSettings> {
    const url = `${this.getBackendContextAddr()}api/settings`;
    return this.http.get<BackendSettings>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error retrieving the backend settings:`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
  }

  getCoverCacheDiskUsage(): Observable<number> {
    const url = `${this.getBackendContextAddr()}api/cover-disk-usage`;
    return this.http.get<number>(url);
  }

  getCoverBlacklist(): Observable<CoverBlacklistFiles> {
    const url = `${this.getBackendContextAddr()}api/cover-blacklist`;
    return this.http.get<CoverBlacklistFiles>(url);
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
