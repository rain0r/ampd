import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/index';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  public isDarkTheme;
  private darkTheme;


  constructor() {
    this.darkTheme = new Subject<boolean>();
    this.isDarkTheme = this.darkTheme.asObservable();
    this.darkTheme.next(true);
  }

  public setDarkTheme(isDarkTheme: boolean): void {
    this.darkTheme.next(isDarkTheme);
  }
}
