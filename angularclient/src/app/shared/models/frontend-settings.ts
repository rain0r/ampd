import { Observable } from "rxjs";

export class FrontendSettings {
  /**
   * True, if the dark theme is enabled.
   */
  private _darkTheme: Observable<boolean> = new Observable();

  /**
   * True, if album covers will be displayed in the queue.
   */
  private _displayCovers: Observable<boolean> = new Observable();

  /**
   * True, if the current playing track will be set as browser tab title.
   */
  private _setTabTitle: Observable<boolean> = new Observable();

  /**
   * True, if the VirtualScrollStrategy will be used to display playlists and directories.
   */
  private _virtualScroll: Observable<boolean> = new Observable();

  get darkTheme(): Observable<boolean> {
    return this._darkTheme;
  }

  set darkTheme(value: Observable<boolean>) {
    this._darkTheme = value;
  }

  get displayCovers(): Observable<boolean> {
    return this._displayCovers;
  }

  set displayCovers(value: Observable<boolean>) {
    this._displayCovers = value;
  }

  get setTabTitle(): Observable<boolean> {
    return this._setTabTitle;
  }

  set setTabTitle(value: Observable<boolean>) {
    this._setTabTitle = value;
  }

  get virtualScroll(): Observable<boolean> {
    return this._virtualScroll;
  }

  set virtualScroll(value: Observable<boolean>) {
    this._virtualScroll = value;
  }
}
