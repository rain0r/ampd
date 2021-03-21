import { Observable } from "rxjs";

export class FrontendSettings {
  private _isDarkTheme: Observable<boolean> = new Observable();
  private _isDisplayCovers: Observable<boolean> = new Observable();
  private _isSetTabTitle: Observable<boolean> = new Observable();

  get isDarkTheme(): Observable<boolean> {
    return this._isDarkTheme;
  }

  set isDarkTheme(value: Observable<boolean>) {
    this._isDarkTheme = value;
  }

  get isDisplayCovers(): Observable<boolean> {
    return this._isDisplayCovers;
  }

  set isDisplayCovers(value: Observable<boolean>) {
    this._isDisplayCovers = value;
  }

  get isSetTabTitle(): Observable<boolean> {
    return this._isSetTabTitle;
  }

  set isSetTabTitle(value: Observable<boolean>) {
    this._isSetTabTitle = value;
  }
}
