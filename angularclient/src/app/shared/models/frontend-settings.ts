import { Observable } from "rxjs";

export class FrontendSettings {
  private _ampdVersion = "";
  private _gitCommitId = "";
  private _isDarkTheme: Observable<boolean> = new Observable();
  private _isDisplayCovers: Observable<boolean> = new Observable();
  private _isDisplaySavePlaylist: Observable<boolean> = new Observable();
  private _isSetTabTitle: Observable<boolean> = new Observable();

  get ampdVersion(): string {
    return this._ampdVersion;
  }

  set ampdVersion(value: string) {
    this._ampdVersion = value;
  }

  get gitCommitId(): string {
    return this._gitCommitId;
  }

  set gitCommitId(value: string) {
    this._gitCommitId = value;
  }

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

  get isDisplaySavePlaylist(): Observable<boolean> {
    return this._isDisplaySavePlaylist;
  }

  set isDisplaySavePlaylist(value: Observable<boolean>) {
    this._isDisplaySavePlaylist = value;
  }

  get isSetTabTitle(): Observable<boolean> {
    return this._isSetTabTitle;
  }

  set isSetTabTitle(value: Observable<boolean>) {
    this._isSetTabTitle = value;
  }
}
