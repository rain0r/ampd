import { ApplicationRef, Injectable, inject } from "@angular/core";
import { SettingKeys } from "../shared/model/internal/frontend-settings";
import { StyleManager } from "../shared/style-manager";
import { FrontendSettingsService } from "./frontend-settings.service";
import { LoggerService } from "./logger.service";

enum Themes {
  Lighter = "lighter",
  Darker = "darker",
}

@Injectable({
  providedIn: "root",
})
export class ThemingService {
  private feSettings = inject(FrontendSettingsService);
  private logger = inject(LoggerService);
  private ref = inject(ApplicationRef);
  private styleManager = inject(StyleManager);

  loadTheme(theme: Themes): void {
    this.styleManager.setStyle("theme", `${theme}.css`);
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

    // Check first, if the user saved a theme in the settings
    const savedTheme = this.feSettings.getStrValue(SettingKeys.DARK_THEME);
    if (savedTheme === "") {
      const theme = darkModeOn ? Themes.Darker : Themes.Lighter;
      this.logger.debug("Setting browser theme", theme);
      this.feSettings.save(SettingKeys.DARK_THEME, theme === Themes.Darker);
    }

    // Then subscribe to apply a them dynamically
    this.feSettings
      .getBoolValue$(SettingKeys.DARK_THEME)
      .subscribe((isDarkTheme) =>
        this.loadTheme(isDarkTheme ? Themes.Darker : Themes.Lighter),
      );

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
