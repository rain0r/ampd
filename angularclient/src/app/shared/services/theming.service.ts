import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  // public isDarkTheme = new Observable();
  public isDarkTheme = this.darkThemeSubj.asObservable();
  // private _darkTheme: Subject<boolean> = new Subject<boolean>();
  private darkThemeSubj = new BehaviorSubject(false);

  constructor() {
    // this.isDarkTheme = this.darkThemeSubj.asObservable();
  }

  public setDarkTheme(isDarkTheme: boolean) {
    this.darkThemeSubj.next(isDarkTheme);
  }
}
