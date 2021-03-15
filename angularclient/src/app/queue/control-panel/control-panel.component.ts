import {Component} from "@angular/core";
import {WebSocketService} from "../../shared/services/web-socket.service";
import {NotificationService} from "../../shared/services/notification.service";
import {MpdService} from "../../shared/services/mpd.service";
import {Observable} from "rxjs";
import {MpdCommands} from "../../shared/mpd/mpd-commands.enum";
import {ControlPanelService} from "../../shared/services/control-panel.service";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent {
  currentState: Observable<string>;

  constructor(
      private controlPanelService : ControlPanelService,
      private mpdService: MpdService,
      private notificationService: NotificationService,
  ) {
    this.currentState = this.mpdService.currentState;
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
    this.controlPanelService.send(command);
  }

  onClearQueue(): void {
    this.mpdService.clearQueue();
    this.notificationService.popUp("Cleared queue");
  }
}
