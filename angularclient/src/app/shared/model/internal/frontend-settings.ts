export enum SettingKeys {
  DARK_THEME = "darkTheme",
  DISPLAY_COVERS = "displayCovers",
  UPDATE_TAB_TITLE = "updateTabTitle",
  BACKEND_ADDR = "backendAddr",
  DISPLAY_INFO_BTN = "displayInfoButton",
}

export interface FrontendSetting {
  name: string;
  type: string;
  value: string;
  description: string;
}

export const darkTheme: FrontendSetting = {
  name: SettingKeys.DARK_THEME,
  type: "bool",
  value: "true",
  description: "Toggle the theme from bright to dark and back.",
};

export const displayCovers: FrontendSetting = {
  name: SettingKeys.DISPLAY_COVERS,
  type: "bool",
  value: "true",
  description: "Toggle if covers should be displayed in the queue.",
};

export const updateTabTitle: FrontendSetting = {
  name: SettingKeys.UPDATE_TAB_TITLE,
  type: "bool",
  value: "true",
  description: "Sets the current track as a tab title.",
};

export const backendAddr: FrontendSetting = {
  name: SettingKeys.BACKEND_ADDR,
  type: "str",
  value: "",
  description:
    "This will be set automatically. Don't change it if ampd works. The name or IP of the computer running ampd.",
};

export const displayInfoBtn: FrontendSetting = {
  name: SettingKeys.DISPLAY_INFO_BTN,
  type: "bool",
  value: "true",
  description: "Show an info button on the queue.",
};
