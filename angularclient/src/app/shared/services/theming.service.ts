import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  // public isDarkTheme = new Observable();

  // private _darkTheme: Subject<boolean> = new Subject<boolean>();
  private darkThemeSubj = new BehaviorSubject(false);
  public isDarkTheme = this.darkThemeSubj.asObservable();
  
  constructor() {
    // this.isDarkTheme = this.darkThemeSubj.asObservable();
  }

  public setDarkTheme(isDarkTheme: boolean) {
    this.darkThemeSubj.next(isDarkTheme);
  }
}
