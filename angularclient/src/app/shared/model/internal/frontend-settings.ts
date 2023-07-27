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
  JUMP_SEEK = "jumpSeek",
}

export interface FrontendSetting {
  name: string; // Used inside localStorage
  label: string; // Used as heading on the frontend
  type: string; // Primitive type of a setting
  value: string;
  description: string; // Shown on the frontend
  category: string;
}

export const FrontendSettings: FrontendSetting[] = [
  {
    name: SettingKeys.DARK_THEME,
    label: "Dark Theme enabled",
    type: "bool",
    value: "",
    description: "Toggle the theme from bright to dark and back.",
    category: "Display",
  },
  {
    name: SettingKeys.DISPLAY_COVERS,
    label: "Display album cover",
    type: "bool",
    value: "true",
    description:
      "Toggle if the cover of an album should be displayed in the queue.",
    category: "Display",
  },
  {
    name: SettingKeys.UPDATE_TAB_TITLE,
    label: "Update tab title",
    type: "bool",
    value: "true",
    description: "Sets the current track as a tab title.",
    category: "Misc",
  },
  {
    name: SettingKeys.BACKEND_ADDR,
    label: "Backend address",
    type: "str",
    value: "",
    description: "Only for developer — you can leave it.",
    category: "Connection",
  },
  {
    name: SettingKeys.DISPLAY_INFO_BTN,
    label: "Display info button",
    type: "bool",
    value: "true",
    description:
      "Show an info button on the queue. This opens a modal with the ID3 tags of the track",
    category: "Display",
  },
  {
    name: SettingKeys.DISPLAY_ALBUMS,
    label: "Show albums link",
    type: "bool",
    value: "true",
    description: "Show a link to the albums view under /browse.",
    category: "Display",
  },
  {
    name: SettingKeys.DISPLAY_GENRES,
    label: "Display genres link",
    type: "bool",
    value: "true",
    description: "Show a link to the genres view under /browse.",
    category: "Display",
  },
  {
    name: SettingKeys.DISPLAY_RADIO,
    label: "Display radio link",
    type: "bool",
    value: "true",
    description: "Show a link to the radio view under /browse.",
    category: "Display",
  },
  {
    name: SettingKeys.DISPLAY_BROWSE_CLEAR_QUEUE,
    label: "Display clear queue button",
    type: "bool",
    value: "true",
    description: "Show a button to clear the queue under /browse.",
    category: "Display",
  },
  {
    name: SettingKeys.JUMP_SEEK,
    label: "Jump inside a track",
    type: "int",
    value: "0",
    description:
      "Amount of seconds to jump inside a track. Controls for it will only be displayed if this value is greater than zero.",
    category: "Control",
  },
];
