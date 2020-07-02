import { Injectable } from "@angular/core";

const DISPLAY_COVERS_KEY = "isDisplayCovers";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  isDisplayCovers(): boolean {
    return this.getBoolValue(DISPLAY_COVERS_KEY);
  }

  setDisplayCovers(displayCovers: boolean): void {
    localStorage.setItem(DISPLAY_COVERS_KEY, JSON.stringify(displayCovers));
  }

  private getBoolValue(key: string): boolean {
    try {
      const saved: string = localStorage.getItem(key) || "";
      return <boolean>JSON.parse(saved);
    } catch (err) {
      return false;
    }
  }
}
