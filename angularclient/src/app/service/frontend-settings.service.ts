import { Injectable } from "@angular/core";
import { BehaviorSubject, first } from "rxjs";
import { FrontendSettings } from "../shared/models/internal/frontend-settings";
import { DarkTheme, LightTheme } from "../shared/themes/themes";

const LS_KEY = "ampd_userSettings";

@Injectable({
  providedIn: "root",
})
export class FrontendSettingsService {
  pageSizeOptions = [20, 50, 100];
  paginationTo = 20;

  private _settings$;
  public settings$;

  constructor() {
    const settings = this.loadFrontendSettings();
    this.setTheme(settings);
    this._settings$ = new BehaviorSubject<FrontendSettings>(settings);
    this.settings$ = this._settings$.asObservable();
  }

  isDarkTheme(): boolean {
    const data = this.loadFrontendSettings();
    return data.darkTheme;
  }

  save(settings: FrontendSettings): void {
    localStorage.setItem(LS_KEY, JSON.stringify(settings));
    this.setTheme(settings);
    this._settings$.next(settings);
  }

  setValue(key: string, value: string | number | boolean): void {
    this.settings$.pipe(first()).subscribe((settings) => {
      switch (key) {
        case "darkTheme":
          settings.darkTheme = Boolean(value).valueOf();
          break;
        case "displayCovers":
          settings.displayCovers = Boolean(value).valueOf();
          break;
        case "pagination":
          settings.pagination = Boolean(value).valueOf();
          break;
        case "updateTabTitle":
          settings.updateTabTitle = Boolean(value).valueOf();
          break;
        case "virtualScroll":
          settings.virtualScroll = Boolean(value).valueOf();
          break;
        case "backendAddr":
          settings.backendAddr = String(value).valueOf();
          break;
        default:
      }
      this.save(settings);
    });
  }

  private loadFrontendSettings(): FrontendSettings {
    const lsData = localStorage.getItem(LS_KEY);
    const defaultUserSettings = {
      darkTheme: true,
      displayCovers: true,
      updateTabTitle: true,
      virtualScroll: false,
    } as FrontendSettings;

    if (lsData === null) {
      return defaultUserSettings;
    } else {
      try {
        const userSettings = <FrontendSettings>JSON.parse(lsData);
        return userSettings;
      } catch (err) {
        return defaultUserSettings;
      }
    }
  }

  private setTheme(settings: FrontendSettings): void {
    const theme = settings.darkTheme ? DarkTheme : LightTheme;
    theme.forEach((value, prop) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }
}
