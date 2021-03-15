import {Component} from "@angular/core";
import {NotificationService} from "../../shared/services/notification.service";
import {MpdService} from "../../shared/services/mpd.service";
import {Observable} from "rxjs";
import {ControlPanelService} from "../../shared/services/control-panel.service";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent {
  currentState: Observable<string>;

  constructor(
      private controlPanelService: ControlPanelService,
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
        this.controlPanelService.prev();
        break;
      case "btn-stop":
        this.controlPanelService.stop();
        break;
      case "btn-pause":
        this.controlPanelService.pause();
        break;
      case "btn-play":
        this.controlPanelService.play();
        break;
      case "btn-next":
        this.controlPanelService.next();
        break;
      default:
        // Ignore it
        return;
    }
  }

  onClearQueue(): void {
    this.mpdService.clearQueue();
    this.notificationService.popUp("Cleared queue");
  }
}
