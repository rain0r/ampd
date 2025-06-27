import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { MpdModesPanel } from "../shared/messages/incoming/mpd-modes-panel";
import { ControlPanelService } from "./control-panel.service";
import { MpdService } from "./mpd.service";
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class MpdModeService {
  private router = inject(Router);
  private controlPanelService = inject(ControlPanelService);
  private mpdService = inject(MpdService);
  private notificationService = inject(NotificationService);

  private mpdModesPanel: MpdModesPanel;
  private mpdModesOpts = ["random", "consume", "single", "crossfade", "repeat"];

  constructor() {
    const mpdService = this.mpdService;

    this.mpdModesPanel = mpdService.initEmptyControlPanel();
    this.mpdService.mpdModesPanel$.subscribe(
      (panel) => (this.mpdModesPanel = panel),
    );
  }

  toggleCtrlFromInput(changedKey: string): void {
    // Only apply mode changes from the queue view
    if (this.router.url !== "/") {
      return;
    }
    const tmpControlPanel = { ...this.mpdModesPanel };
    for (const [key, value] of Object.entries(this.mpdModesPanel)) {
      if (key === changedKey) {
        this.mpdModesPanel[key as keyof MpdModesPanel] = !value;
      }
    }
    this.showMessage(tmpControlPanel);
    this.controlPanelService.toggleMpdModes(this.mpdModesPanel);
  }

  toggleCtrl(changedKey: string): void {
    // pass all key:value pairs from an object
    const tmpControlPanel = { ...this.mpdModesPanel };
    for (const key in this.mpdModesPanel) {
      this.mpdModesPanel[key as keyof MpdModesPanel] = changedKey.includes(key);
    }
    this.showMessage(tmpControlPanel);
    this.controlPanelService.toggleMpdModes(this.mpdModesPanel);
  }

  private showMessage(tmpControlPanel: MpdModesPanel): void {
    for (const opt of this.mpdModesOpts) {
      if (
        tmpControlPanel[opt as keyof MpdModesPanel] !==
        this.mpdModesPanel[opt as keyof MpdModesPanel]
      ) {
        const on = this.mpdModesPanel[opt as keyof MpdModesPanel]
          ? "on"
          : "off";
        this.notificationService.popUp(`Turned ${opt} ${on}`);
      }
    }
  }
}
