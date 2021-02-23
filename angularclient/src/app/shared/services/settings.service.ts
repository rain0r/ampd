import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {BackendSettings} from "../models/backend-settings";
import {HttpClient} from "@angular/common/http";
import {ApiEndpoints} from "../api-endpoints";
import {BACKEND_ADDRESS_KEY, DARK_MODE_KEY} from "../local-storage-keys";
import {CoverBlacklistFiles} from "../models/cover-blacklist-files";
import {Location} from "@angular/common";
import {DarkTheme, LightTheme} from "../themes/themes";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  /**
   * Since we want this to be automatically applied, we store it in a subject.
   * Dark theme is default active.
   */
  private isDarkThemeSubject = new BehaviorSubject(true);

  constructor(private http: HttpClient, private location: Location) {
    const isDarkTheme: boolean = this.getBoolValue(DARK_MODE_KEY);
    this.setTheme(isDarkTheme);
  }

  isDarkTheme(): Observable<boolean> {
    return this.isDarkThemeSubject.asObservable();
  }

  setTheme(isDarkTheme: boolean): void {
    localStorage.setItem(DARK_MODE_KEY, JSON.stringify(isDarkTheme));
    this.isDarkThemeSubject.next(isDarkTheme);
    if (isDarkTheme) {
      this.changeTheme(DarkTheme);
    } else {
      this.changeTheme(LightTheme);
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
    const url = `${this.getBackendContextAddr()}api/settings`;
    return this.http.get<BackendSettings>(url);
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
   * Returns the api endpoint of the backend that looks for covers in a directory specified by
   * a track path.
   */
  getFindTrackCoverUrl(): string {
    return `${this.getBackendContextAddr()}api/find-track-cover`;
  }

  /**
   * Returns the api endpoint of the backend that returns info about a specific playlist.
   * @param playlistName The playlist to get the info on.
   */
  getPlaylistInfoUrl(playlistName: string): string {
    return `${this.getBackendContextAddr()}api/playlist/${playlistName}`;
  }

  /**
   * See the corresponding method in {@link ApiEndpoints}.
   */
  getBackendAddr(): string {
    return ApiEndpoints.getBackendAddr();
  }

  /**
   * Returns the API-base URL respecting a potential context. For example, if the base href is set to 'ampd' it will
   * return 'example.com/ampd'.
   */
  getBackendContextAddr(): string {
    const backendContextAddr = `${ApiEndpoints.getBackendAddr()}${this.location.prepareExternalUrl(
        ""
    )}`;
    return backendContextAddr;
  }

  setBackendAddr(backendAddr: string): void {
    console.log("setBackendAddr()")
    console.log("BACKEND_ADDRESS_KEY", BACKEND_ADDRESS_KEY)
    localStorage.setItem(BACKEND_ADDRESS_KEY, backendAddr);
    console.log("BACKEND_ADDRESS_KEY", localStorage.getItem(BACKEND_ADDRESS_KEY))
  }

  private changeTheme(theme: Map<string, string>): void {
    theme.forEach((value, prop) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }
}
