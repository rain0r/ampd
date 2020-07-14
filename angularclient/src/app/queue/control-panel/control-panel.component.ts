import { Component } from "@angular/core";
import { ControlPanel } from "../../shared/messages/incoming/control-panel";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { NotificationService } from "../../shared/services/notification.service";
import { MpdService } from "../../shared/services/mpd.service";
import { Observable } from "rxjs";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent {
  currentState: Observable<string>;
  controlPanel: Observable<ControlPanel>;

  constructor(
    private mpdService: MpdService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {
    this.currentState = this.mpdService.getStateSubscription();
    this.controlPanel = this.mpdService.getControlPanelSubscription();
  }

  handleControlButton(event: MouseEvent): void {
    let command;
    const element = event.currentTarget as HTMLInputElement;
    switch (element.id) {
      case "btn-prev":
        command = MpdCommands.SET_PREV;
        break;
      case "btn-stop":
        command = MpdCommands.SET_STOP;
        break;
      case "btn-pause":
        command = MpdCommands.SET_PAUSE;
        break;
      case "btn-play":
        command = MpdCommands.SET_PLAY;
        break;
      case "btn-next":
        command = MpdCommands.SET_NEXT;
        break;
      default:
        // Ignore it
        return;
    }
    if (command) {
      this.webSocketService.send(command);
    }
  }

  onClearQueue(): void {
    this.webSocketService.send(MpdCommands.RM_ALL);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
    this.notificationService.popUp("Cleared queue");
  }
}
