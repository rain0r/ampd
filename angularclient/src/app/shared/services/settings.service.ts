import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { BackendSettings } from "../models/backend-settings";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiEndpoints } from "../api-endpoints";
import {
  BACKEND_ADDRESS,
  DARK_MODE,
  DISPLAY_COVERS,
  SET_TAB_TITLE,
  VIRTUAL_SCROLL,
} from "../local-storage-keys";
import { CoverBlacklistFiles } from "../models/cover-blacklist-files";
import { Location } from "@angular/common";
import { DarkTheme, LightTheme } from "../themes/themes";
import { FrontendSettings } from "../models/frontend-settings";
import { catchError } from "rxjs/operators";
import { ErrorMsg } from "../error/error-msg";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  darkTheme: Observable<boolean>;
  displayCovers: Observable<boolean>;
  setTabTitle: Observable<boolean>;
  virtualScroll: Observable<boolean>;

  /**
   * Since we want this to be automatically applied, we store it in a subject.
   * Dark theme is default active.
   */
  darkTheme$ = new BehaviorSubject(true);

  private isDisplayCovers$ = new BehaviorSubject(true);
  private setTabTitle$ = new BehaviorSubject(true);
  private virtualScroll$ = new BehaviorSubject(false);

  constructor(private http: HttpClient, private location: Location) {
    this.darkTheme = this.darkTheme$.asObservable();
    this.displayCovers = this.isDisplayCovers$.asObservable();
    this.setTabTitle = this.setTabTitle$.asObservable();
    this.virtualScroll = this.virtualScroll$.asObservable();

    this.initFrontendSettings();
  }

  /*
   * Setters
   */
  setDarkTheme(darkTheme: boolean): void {
    localStorage.setItem(DARK_MODE, JSON.stringify(darkTheme));
    this.darkTheme$.next(darkTheme);
    const theme = darkTheme ? DarkTheme : LightTheme;
    theme.forEach((value, prop) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }

  setDisplayCovers(displayCovers: boolean): void {
    localStorage.setItem(DISPLAY_COVERS, JSON.stringify(displayCovers));
    this.isDisplayCovers$.next(displayCovers);
  }

  setTabTitleOption(tabTitle: boolean): void {
    localStorage.setItem(SET_TAB_TITLE, JSON.stringify(tabTitle));
    this.setTabTitle$.next(tabTitle);
  }

  setVirtualScroll(virtualScroll: boolean): void {
    localStorage.setItem(VIRTUAL_SCROLL, JSON.stringify(virtualScroll));
    this.virtualScroll$.next(virtualScroll);
  }

  blacklistCover(file: string): Observable<void> {
    const url = `${this.getBackendContextAddr()}api/blacklist-cover`;
    return this.http.post<void>(url, file);
  }

  setBackendAddr(backendAddr: string): void {
    localStorage.setItem(BACKEND_ADDRESS, backendAddr);
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

  getFrontendSettings(): FrontendSettings {
    const frontendSettings = new FrontendSettings();
    frontendSettings.darkTheme = this.darkTheme;
    frontendSettings.displayCovers = this.displayCovers;
    frontendSettings.setTabTitle = this.setTabTitle;
    frontendSettings.virtualScroll = this.virtualScroll;
    return frontendSettings;
  }

  /**
   * Load a specific key from localStorage.
   *
   * @param key The localStorage-key.
   * @param defaultValue Return value if no localStorage-entry was found.
   */
  private getBoolValue(key: string, defaultValue = false): boolean {
    try {
      const value: string =
        localStorage.getItem(key) || defaultValue.toString();
      return value === "true";
    } catch (err) {
      return defaultValue;
    }
  }

  private initFrontendSettings(): void {
    // Initialize frontend settings
    this.setDarkTheme(this.getBoolValue(DARK_MODE, true));
    this.setDisplayCovers(this.getBoolValue(DISPLAY_COVERS, true));
    this.setTabTitleOption(this.getBoolValue(SET_TAB_TITLE, true));
    this.setVirtualScroll(this.getBoolValue(VIRTUAL_SCROLL, false));
  }
}
