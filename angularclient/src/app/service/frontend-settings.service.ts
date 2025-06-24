import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import {
  FrontendSettings,
  SettingKeys,
} from "../shared/model/internal/frontend-settings";
import { FrontendSetting } from "./../shared/model/internal/frontend-settings";
import { LoggerService } from "./logger.service";

const LS_KEY = "ampd_userSettings";

@Injectable({
  providedIn: "root",
})
export class FrontendSettingsService {
  private logger = inject(LoggerService);

  pageSizeOptions = [5, 20, 50, 100];

  private settings: FrontendSetting[] = FrontendSettings;
  private settings$: Observable<FrontendSetting[]>;
  private settingsSub$: BehaviorSubject<FrontendSetting[]>;

  constructor() {
    this.settingsSub$ = new BehaviorSubject<FrontendSetting[]>(
      this.loadFrontendSettings(),
    );
    this.settings$ = this.settingsSub$.asObservable();
  }

  save(name: SettingKeys, value: string | number | boolean): void {
    const index = this.settings.findIndex((s) => s.name === name);
    if (index === -1) {
      this.logger.error("Could not find frontend setting with name: ", name);
      return;
    }
    this.settings[index].value = String(value);
    this.persist();
    this.settingsSub$.next(this.settings);
  }

  getIntValue$(key: SettingKeys): Observable<number> {
    return this.getValue$(key).pipe(map((s) => Number(s.value)));
  }

  getStrValue$(key: SettingKeys): Observable<string> {
    return this.getValue$(key).pipe(map((s) => String(s.value)));
  }

  getBoolValue$(key: SettingKeys): Observable<boolean> {
    return this.getValue$(key).pipe(map((s) => s.value === "true"));
  }

  getIntValue(key: SettingKeys): number {
    const elem = this.settings.find((s) => s.name === key);
    return Number(elem ? elem.value : "");
  }

  getStrValue(key: SettingKeys): string {
    const elem = this.settings.find((s) => s.name === key);
    return String(elem ? elem.value : "");
  }

  getBoolValue(key: SettingKeys): boolean {
    const elem = this.settings.find((s) => s.name === key);
    return elem ? elem.value === "true" : false;
  }

  loadFrontendSettings$(): Observable<FrontendSetting[]> {
    return this.settings$;
  }

  loadFrontendSettings(): FrontendSetting[] {
    const lsData = localStorage.getItem(LS_KEY) || "";
    try {
      const savedSettings = JSON.parse(lsData) as FrontendSetting[];
      for (const setting of savedSettings) {
        const elem = this.settings.find(
          (s) => s.name === setting.name && s.value !== setting.value,
        );
        if (elem) {
          this.logger.debug(
            `Changing ${elem.name} from "${elem.value}" (default value) to "${setting.value}" (user setting)`,
          );
          elem.value = setting.value;
        }
      }
    } catch (err) {
      // Error loading frontend settings
      console.trace(err);
    }

    return this.settings.sort((a, b) => a.category.localeCompare(b.category));
  }

  reset(): void {
    localStorage.setItem(LS_KEY, "");
  }

  private getValue$(key: SettingKeys): Observable<FrontendSetting> {
    return this.settings$.pipe(
      map((s) => {
        const elem = s.find((it) => it.name === key);
        if (elem) {
          return elem;
        } else {
          this.logger.error("Could not find setting: ", key);
          return {} as FrontendSetting;
        }
      }),
    );
  }

  private persist(): void {
    localStorage.setItem(LS_KEY, JSON.stringify(this.settings));
  }
}
