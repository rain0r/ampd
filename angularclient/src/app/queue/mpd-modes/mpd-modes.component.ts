import { Component, HostListener } from "@angular/core";
import { ControlPanel } from "../../shared/messages/incoming/control-panel";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { MpdService } from "../../shared/services/mpd.service";
import { NotificationService } from "../../shared/services/notification.service";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-mpd-modes",
  templateUrl: "./mpd-modes.component.html",
  styleUrls: ["./mpd-modes.component.scss"],
})
export class MpdModesComponent {
  controlPanel: ControlPanel;
  private currentState = "stop";
  private controlPanelOpts = [
    "random",
    "consume",
    "single",
    "crossfade",
    "repeat",
  ];

  constructor(
    private webSocketService: WebSocketService,
    private mpdService: MpdService,
    private notificationService: NotificationService
  ) {
    this.mpdService
      .getControlPanelSubscription()
      .subscribe((panel) => (this.controlPanel = panel));
    this.mpdService
      .getStateSubscription()
      .subscribe((state) => (this.currentState = state));
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.tagName === "MAT-SLIDER") {
      /* We want to change the volume (with the keyboard) - not skip the track. */
      return;
    }

    if (inputElement.tagName === "INPUT") {
      /* We want to search for something - not skip the track. */
      return;
    }

    let command;
    switch (event.key) {
      case "ArrowLeft": // Left: Previous track
        command = MpdCommands.SET_PREV;
        break;
      case "ArrowRight": // Right: Next track
        command = MpdCommands.SET_NEXT;
        break;
      case "p":
      case " ": // Space or 'p': pause
        if (this.currentState === "pause") {
          command = MpdCommands.SET_PLAY;
        } else if (this.currentState === "play") {
          command = MpdCommands.SET_PAUSE;
        }
        break;
      default:
        // Ignore it
        return;
    }
    if (command) {
      this.webSocketService.send(command);
      event.preventDefault();
    }
  }

  toggleCtrl(event: MatButtonToggleChange): void {
    const tmpControlPanel = { ...this.controlPanel };

    for (const key in this.controlPanel) {
      this.controlPanel[key] = (event.value as string).includes(key);
    }
    this.showMessage(tmpControlPanel);
    this.webSocketService.sendData(MpdCommands.TOGGLE_CONTROL, {
      controlPanel: this.controlPanel,
    });
  }

  private showMessage(tmpControlPanel: ControlPanel) {
    for (const opt of this.controlPanelOpts) {
      if (tmpControlPanel[opt] !== this.controlPanel[opt]) {
        const on = this.controlPanel[opt] ? "on" : "off";
        this.notificationService.popUp(`Turned ${opt} ${on}`);
      }
    }
  }
}
