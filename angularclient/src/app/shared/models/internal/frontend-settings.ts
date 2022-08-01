export const DARK_THEME = "darkTheme";

export const DISPLAY_COVERS = "displayCovers";

export const PAGINATION = "pagination";

export const UPDATE_TAB_TITLE = "updateTabTitle";

export const VIRTUAL_SCROLL = "virtualScroll";

export const BACKEND_ADDR = "backendAddr";

export interface FrontendSettings {
  darkTheme: boolean;
  displayCovers: boolean;
  pagination: boolean;
  updateTabTitle: boolean;
  virtualScroll: boolean;
  backendAddr: string;
}
