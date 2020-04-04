import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';

const IS_DARK_MODE_KEY = 'isDarkTheme';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  public darkThemeSubj = new BehaviorSubject(false);
  public isDarkTheme = this.darkThemeSubj.asObservable();


  constructor() {
    console.log("constructor");
    this.darkThemeSubj.next(this.loadState());
  }

  public setDarkTheme(isDarkTheme: boolean) {
    this.darkThemeSubj.next(isDarkTheme);
    this.saveState(isDarkTheme);
  }

  private loadState(): boolean {
    try {
      const saved: string = localStorage.getItem(IS_DARK_MODE_KEY) || '';
      return JSON.parse(saved);
    }
    catch (err) {
      return false;
    }
  }

  private saveState(isDarkTheme: boolean): void {
    localStorage.setItem(IS_DARK_MODE_KEY, JSON.stringify(isDarkTheme));
  }
}
