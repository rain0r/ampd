import { Component } from "@angular/core";
import { ControlPanel } from "../../shared/messages/incoming/control-panel";
import { MpdService } from "../../shared/services/mpd.service";
import { MpdModeService } from "../../shared/services/mpd-mode.service";

@Component({
  selector: "app-mpd-modes",
  templateUrl: "./mpd-mode.component.html",
  styleUrls: ["./mpd-mode.component.scss"],
})
export class MpdModeComponent {
  controlPanel: ControlPanel;
  private currentState = "stop";

  constructor(
    private mpdModeService: MpdModeService,
    private mpdService: MpdService
  ) {
    this.mpdService.controlPanel.subscribe(
      (panel) => (this.controlPanel = panel)
    );
    this.mpdService.currentState.subscribe(
      (state) => (this.currentState = state)
    );
  }

  toggleCtrl(key: string): void {
    this.mpdModeService.toggleCtrl(key);
  }
}
