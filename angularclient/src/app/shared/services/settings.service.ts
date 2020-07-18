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
   * Dark theme is default active.
   */
  private isDarkThemeSubject = new BehaviorSubject(true);

  constructor(private http: HttpClient) {
    this.setDarkTheme(this.getBoolValue(DARK_MODE_KEY));
  }

  isDarkTheme(): Observable<boolean> {
    return this.isDarkThemeSubject.asObservable();
  }

  setDarkTheme(darkTheme: boolean): void {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(darkTheme));
    this.isDarkThemeSubject.next(darkTheme);
    if (darkTheme) {
      this.changeTheme("#607d8b", "#ff9100", "#868e96", "white");
    } else {
      this.changeTheme("#eeee", "#eeee", "#000", "rgba(0, 0, 0, 0.87)");
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

  getBackendSettings(): Observable<BackendSettings> {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const url = `${backendAddr}/api/settings`;
    return this.http.get<BackendSettings>(url);
  }

  getCoverCacheDiskUsage(): Observable<number> {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const url = `${backendAddr}/api/cover-usage`;
    return this.http.get<number>(url);
  }

  getCoverBlacklist(): Observable<string[]> {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const url = `${backendAddr}/api/cover-blacklist`;
    return this.http.get<string[]>(url);
  }

  private changeTheme(
    hoverBackgroundColor: string,
    backgroundColor: string,
    borderColor: string,
    fontColor: string
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
    document.documentElement.style.setProperty("--font-color", fontColor);
  }
}
