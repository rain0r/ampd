import {Injectable} from "@angular/core";
import {MpdCommands} from "../mpd/mpd-commands.enum";
import {ControlPanel} from "../messages/incoming/control-panel";
import {NotificationService} from "./notification.service";
import {MpdService} from "./mpd.service";
import {WebSocketService} from "./web-socket.service";

@Injectable({
  providedIn: "root",
})
export class MpdModeService {
  private controlPanel: ControlPanel;
  private controlPanelOpts = [
    "random",
    "consume",
    "single",
    "crossfade",
    "repeat",
  ];

  constructor(
      private notificationService: NotificationService,
      private mpdService: MpdService,
      private webSocketService: WebSocketService
  ) {
    this.controlPanel = mpdService.initEmptyControlPanel();
    this.mpdService.controlPanel.subscribe(
        (panel) => (this.controlPanel = panel)
    );
  }

  toggleCtrlFromInput(changedKey: string): void {
    const tmpControlPanel = {...this.controlPanel};
    for (const [key, value] of Object.entries(this.controlPanel)) {
      if (key === changedKey) {
        this.controlPanel[key as keyof ControlPanel] = !value;
      }
    }
    this.showMessage(tmpControlPanel);
    this.webSocketService.sendData(MpdCommands.TOGGLE_CONTROL, {
      controlPanel: this.controlPanel,
    });
  }

  toggleCtrl(changedKey: string): void {
    // pass all key:value pairs from an object
    const tmpControlPanel = {...this.controlPanel};
    for (const key in this.controlPanel) {
      this.controlPanel[key as keyof ControlPanel] = changedKey.includes(key);
    }
    this.showMessage(tmpControlPanel);
    this.webSocketService.sendData(MpdCommands.TOGGLE_CONTROL, {
      controlPanel: this.controlPanel,
    });
  }

  private showMessage(tmpControlPanel: ControlPanel): void {
    for (const opt of this.controlPanelOpts) {
      if (
          tmpControlPanel[opt as keyof ControlPanel] !==
          this.controlPanel[opt as keyof ControlPanel]
      ) {
        const on = this.controlPanel[opt as keyof ControlPanel] ? "on" : "off";
        this.notificationService.popUp(`Turned ${opt} ${on}`);
      }
    }
  }
}
