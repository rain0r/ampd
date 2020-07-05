import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

const DARK_MODE_KEY = "isDarkTheme";
const DISPLAY_COVERS_KEY = "isDisplayCovers";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private darkThemeSubject = new BehaviorSubject(false);

  constructor() {
    this.setDarkTheme(this.getBoolValue(DARK_MODE_KEY));
  }

  isDarkTheme(): Observable<boolean> {
    return this.darkThemeSubject.asObservable();
  }

  isDisplayCovers(): boolean {
    return this.getBoolValue(DISPLAY_COVERS_KEY);
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

  setDisplayCovers(displayCovers: boolean): void {
    localStorage.setItem(DISPLAY_COVERS_KEY, JSON.stringify(displayCovers));
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

  private getBoolValue(key: string): boolean {
    try {
      const saved: string = localStorage.getItem(key) || "";
      return <boolean>JSON.parse(saved);
    } catch (err) {
      return false;
    }
  }
}
