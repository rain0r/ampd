import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ConnConfUtil } from "../conn-conf/conn-conf-util";
import { BackendSettings } from "../models/backend-settings";
import { HttpClient } from "@angular/common/http";

export const DARK_MODE_KEY = "isDarkTheme";
export const DISPLAY_COVERS_KEY = "isDisplayCovers";
export const DISPLAY_SAVE_PLAYLIST_KEY = "isDisplaySavePlaylist";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  /**
   * Since we want this to be automatically applied, we store it in a subject.
   */
  private darkThemeSubject = new BehaviorSubject(false);

  constructor(private http: HttpClient) {
    this.setDarkTheme(this.getBoolValue(DARK_MODE_KEY));
  }

  isDarkTheme(): Observable<boolean> {
    return this.darkThemeSubject.asObservable();
  }

  setDarkTheme(darkTheme: boolean): void {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkTheme));
    this.darkThemeSubject.next(darkTheme);
    if (darkTheme) {
      this.changeTheme("#607d8b", "#ff9100", "#868e96");
    } else {
      this.changeTheme("#eeee", "#eeee", "#000");
    }
  }

  setBoolVale(key: string, value: boolean): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getBoolValue(key: string, defaultValue = false): boolean {
    try {
      const saved: string =
        localStorage.getItem(key) || defaultValue.toString();
      return <boolean>JSON.parse(saved);
    } catch (err) {
      return defaultValue;
    }
  }

  getBackendSettings() {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const url = `${backendAddr}/api/settings`;
    return this.http.get<BackendSettings>(url);
  }

  getCoverCacheDiskUsage() {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const url = `${backendAddr}/api/cover-usage`;
    return this.http.get<number>(url);
  }

  getCoverBlacklist() {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const url = `${backendAddr}/api/cover-blacklist`;
    return this.http.get<string[]>(url);
  }

  private changeTheme(
    hoverBackgroundColor: string,
    backgroundColor: string,
    borderColor: string
  ): void {
    document.documentElement.style.setProperty(
      "--hover-background-color",
      hoverBackgroundColor
    );
    document.documentElement.style.setProperty(
      "--background-color",
      backgroundColor
    );
    document.documentElement.style.setProperty("--border-color", borderColor);
  }
}
