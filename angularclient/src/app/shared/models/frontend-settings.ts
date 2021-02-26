import { Observable } from "rxjs";

export class FrontendSettings {
  private _ampdVersion: string;
  private _gitCommitId: string;
  private _isDarkTheme: Observable<boolean>;
  private _isDisplayCovers: Observable<boolean>;
  private _isDisplaySavePlaylist: Observable<boolean>;
  private _isSetTabTitle: Observable<boolean>;

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
