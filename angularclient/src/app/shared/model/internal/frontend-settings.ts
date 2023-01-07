export enum SettingKeys {
  DARK_THEME = "darkTheme",
  DISPLAY_COVERS = "displayCovers",
  UPDATE_TAB_TITLE = "updateTabTitle",
  BACKEND_ADDR = "backendAddr",
  DISPLAY_INFO_BTN = "displayInfoButton",
  DISPLAY_ALBUMS = "displayAlbums",
  DISPLAY_GENRES = "displayGenres",
  DISPLAY_RADIO = "displayRadio",
  DISPLAY_BROWSE_CLEAR_QUEUE = "displayBrowseClearQueue",
}

export interface FrontendSetting {
  name: string;
  type: string;
  value: string;
  description: string;
}

export const FrontendSettings: FrontendSetting[] = [
  {
    name: SettingKeys.DARK_THEME,
    type: "bool",
    value: "",
    description: "Toggle the theme from bright to dark and back.",
  },
  {
    name: SettingKeys.DISPLAY_COVERS,
    type: "bool",
    value: "true",
    description: "Toggle if covers should be displayed in the queue.",
  },
  {
    name: SettingKeys.UPDATE_TAB_TITLE,
    type: "bool",
    value: "true",
    description: "Sets the current track as a tab title.",
  },
  {
    name: SettingKeys.BACKEND_ADDR,
    type: "str",
    value: "",
    description:
      "This will be set automatically. Don't change it if ampd works. The name or IP of the computer running ampd.",
  },
  {
    name: SettingKeys.DISPLAY_INFO_BTN,
    type: "bool",
    value: "true",
    description: "Show an info button on the queue.",
  },
  {
    name: SettingKeys.DISPLAY_ALBUMS,
    type: "bool",
    value: "true",
    description: "Show a link to the albums view under /browse.",
  },
  {
    name: SettingKeys.DISPLAY_GENRES,
    type: "bool",
    value: "true",
    description: "Show a link to the genres view under /browse.",
  },
  {
    name: SettingKeys.DISPLAY_RADIO,
    type: "bool",
    value: "true",
    description: "Show a link to the radio view under /browse.",
  },
  {
    name: SettingKeys.DISPLAY_BROWSE_CLEAR_QUEUE,
    type: "bool",
    value: "true",
    description: "Show a button to clear the queue under /browse.",
  },
];
