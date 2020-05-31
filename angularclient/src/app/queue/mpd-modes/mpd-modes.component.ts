import { Component, HostListener, Input } from "@angular/core";
import {
  ControlPanelImpl,
  IControlPanel,
} from "../../shared/messages/incoming/control-panel";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { WebSocketService } from "../../shared/services/web-socket.service";

@Component({
  selector: "app-mpd-modes",
  templateUrl: "./mpd-modes.component.html",
  styleUrls: ["./mpd-modes.component.scss"],
})
export class MpdModesComponent {
  @Input() controlPanel: IControlPanel = new ControlPanelImpl();
  @Input() private currentState = "";

  constructor(private webSocketService: WebSocketService) {}

  toggleCtrl(event): void {
    for (const key in this.controlPanel) {
      if (event.value.includes(key)) {
        this.controlPanel[key] = true;
      } else {
        this.controlPanel[key] = false;
      }
    }
    this.webSocketService.sendData(MpdCommands.TOGGLE_CONTROL, {
      controlPanel: this.controlPanel,
    });
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent) {
    if (!event || !event.srcElement) {
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.tagName === "MAT-SLIDER") {
      /* We want to change the volume (with the keyboard) - not skip the track. */
      return;
    }

    if (inputElement.tagName === "INPUT") {
      /* We want to search for something - not skip the track. */
      return;
    }

    let command = "";

    switch (event.which) {
      case 37: // left
        command = MpdCommands.SET_PREV;
        break;
      case 39: // right
        command = MpdCommands.SET_NEXT;
        break;
      case 32: // space
        if (this.currentState === "pause") {
          command = MpdCommands.SET_PLAY;
        } else if (this.currentState === "play") {
          command = MpdCommands.SET_PAUSE;
        }
        break;
      default:
      // Ignore it
    }
    if (command) {
      this.webSocketService.send(command);
      event.preventDefault();
    }
  }
}
