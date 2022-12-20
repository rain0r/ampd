import { ApplicationRef, Injectable } from "@angular/core";
import { SettingKeys } from "../shared/model/internal/frontend-settings";
import { StyleManager } from "../shared/style-manager";
import { FrontendSettingsService } from "./frontend-settings.service";

enum Themes {
  Lighter = "lighter",
  Darker = "darker",
}

@Injectable({
  providedIn: "root",
})
export class ThemingService {
  constructor(
    private feSettings: FrontendSettingsService,
    private ref: ApplicationRef,
    private styleManager: StyleManager
  ) {}

  loadTheme(theme: Themes): void {
    console.log("loading", theme);
    this.styleManager.setStyle("theme", `${theme}.css`);

    // TODO this.feSettings.save(SettingKeys.DARK_THEME, isLightTheme === false);
  }

  /**
   * Sets the theme according to localStorage and browser settings.
   *
   * @returns True, if lightTheme is enabled.
   */
  onLoad(): boolean {
    // Initially check if dark mode is enabled on system
    const darkModeOn =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isLightTheme =
      darkModeOn === false ||
      this.feSettings.getBoolValue(SettingKeys.DARK_THEME) === true;

    this.feSettings
      .getStrValue$(SettingKeys.DARK_THEME)
      .subscribe((isDarkTheme) => {
        // console.log("darkTheme", isDarkTheme)
        let theme;

        if (isDarkTheme) {
          console.log("Setting saved theme", isDarkTheme);
          theme = isDarkTheme === "true" ? Themes.Darker : Themes.Lighter;
        } else {
          console.log("Setting browser theme", darkModeOn);
          theme = darkModeOn ? Themes.Darker : Themes.Lighter;
        }

        this.loadTheme(theme);
      });

    // Watch for changes of the preference
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        this.loadTheme(e.matches === false ? Themes.Lighter : Themes.Darker);
        // Trigger refresh of UI
        this.ref.tick();
      });

    return isLightTheme;
  }
}
