import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs/index";

const IS_DARK_MODE_KEY = "isDarkTheme";

@Injectable({
  providedIn: "root",
})
export class ThemingService {
  isDarkTheme: Observable<boolean>;
  private darkThemeSubj = new BehaviorSubject(false);

  constructor() {
    this.setDarkTheme(this.loadState());
  }

  setDarkTheme(isDarkTheme: boolean): void {
    this.isDarkTheme = this.darkThemeSubj.asObservable();
    this.darkThemeSubj.next(isDarkTheme);
    this.saveState(isDarkTheme);

    if (isDarkTheme) {
      this.changeTheme("#607d8b", "#ff9100", "#868e96");
    } else {
      this.changeTheme("#eeee", "#eeee", "#000");
    }
  }

  changeTheme(
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

  private loadState(): boolean {
    try {
      const saved: string = localStorage.getItem(IS_DARK_MODE_KEY) || "";
      return <boolean>JSON.parse(saved);
    } catch (err) {
      return false;
    }
  }

  private saveState(isDarkTheme: boolean): void {
    localStorage.setItem(IS_DARK_MODE_KEY, JSON.stringify(isDarkTheme));
  }
}
