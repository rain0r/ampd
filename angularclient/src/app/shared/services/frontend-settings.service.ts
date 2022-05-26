import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  KEY_DARK_THEME,
  KEY_DISPLAY_COVERS,
  KEY_PAGINATION,
  KEY_SET_TAB_TITLE,
  KEY_VIRTUAL_SCROLL,
} from "../local-storage-keys";
import { DarkTheme, LightTheme } from "../themes/themes";

/**
 * Dark theme.
 */
export const DEFAULT_DARK_THEME = true;

/**
 * Display cover on the queue.
 */
export const DEFAULT_DISPLAY_COVERS = true;

/**
 * Set the current track as tab title.
 */
export const DEFAULT_TAB_TITLE = false;

/**
 * Virtual scrolling in browse.
 */
export const DEFAULT_VIRTUAL_SCROLL = false;

/**
 * Pagination in browse.
 */
export const DEFAULT_PAGINATION = true;

@Injectable({
  providedIn: "root",
})
export class FrontendSettingsService {
  darkTheme: Observable<boolean>;
  displayCovers: Observable<boolean>;
  pagination: Observable<boolean>;
  setTabTitle: Observable<boolean>;
  virtualScroll: Observable<boolean>;

  /**
   * Since we want this to be automatically applied, we store it in a subject.
   * Dark theme is default active.
   */
  darkTheme$ = new BehaviorSubject(true);

  pageSizeOptions = [20, 50, 100];
  paginationTo = 20;

  private isDisplayCovers$ = new BehaviorSubject(DEFAULT_DISPLAY_COVERS);
  private pagination$ = new BehaviorSubject(DEFAULT_PAGINATION);
  private setTabTitle$ = new BehaviorSubject(DEFAULT_TAB_TITLE);
  private virtualScroll$ = new BehaviorSubject(DEFAULT_VIRTUAL_SCROLL);

  constructor() {
    this.darkTheme = this.darkTheme$.asObservable();
    this.displayCovers = this.isDisplayCovers$.asObservable();
    this.pagination = this.pagination$.asObservable();
    this.setTabTitle = this.setTabTitle$.asObservable();
    this.virtualScroll = this.virtualScroll$.asObservable();

    this.initFrontendSettings();
  }

  /*
   * Setters
   */
  setDarkTheme(darkTheme: boolean): void {
    localStorage.setItem(KEY_DARK_THEME, JSON.stringify(darkTheme));
    this.darkTheme$.next(darkTheme);
    const theme = darkTheme ? DarkTheme : LightTheme;
    theme.forEach((value, prop) => {
      document.documentElement.style.setProperty(prop, value);
    });
  }

  setDisplayCovers(displayCovers: boolean): void {
    localStorage.setItem(KEY_DISPLAY_COVERS, JSON.stringify(displayCovers));
    this.isDisplayCovers$.next(displayCovers);
  }

  setPagination(checked: boolean): void {
    localStorage.setItem(KEY_PAGINATION, JSON.stringify(checked));
    this.pagination$.next(checked);
  }

  setTabTitleOption(tabTitle: boolean): void {
    localStorage.setItem(KEY_SET_TAB_TITLE, JSON.stringify(tabTitle));
    this.setTabTitle$.next(tabTitle);
  }

  setVirtualScroll(virtualScroll: boolean): void {
    localStorage.setItem(KEY_VIRTUAL_SCROLL, JSON.stringify(virtualScroll));
    this.virtualScroll$.next(virtualScroll);
  }

  /**
   * Load a specific key from localStorage.
   *
   * @param key The localStorage-key.
   * @param defaultValue Return value if no localStorage-entry was found.
   */
  private getBoolValue(key: string, defaultValue = false): boolean {
    try {
      const value: string =
        localStorage.getItem(key) || defaultValue.toString();
      return value === "true";
    } catch (err) {
      return defaultValue;
    }
  }

  /**
   * Initializes the frontend settings with the values from localStorage.
   */
  private initFrontendSettings(): void {
    this.setDarkTheme(this.getBoolValue(KEY_DARK_THEME, DEFAULT_DARK_THEME));
    this.setDisplayCovers(
      this.getBoolValue(KEY_DISPLAY_COVERS, DEFAULT_DISPLAY_COVERS)
    );
    this.setPagination(this.getBoolValue(KEY_PAGINATION, DEFAULT_PAGINATION));
    this.setTabTitleOption(
      this.getBoolValue(KEY_SET_TAB_TITLE, DEFAULT_TAB_TITLE)
    );
    this.setVirtualScroll(
      this.getBoolValue(KEY_VIRTUAL_SCROLL, DEFAULT_VIRTUAL_SCROLL)
    );
  }
}
