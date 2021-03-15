import {Injectable} from '@angular/core';
import {MpdCommands} from "../mpd/mpd-commands.enum";
import {RxStompService} from "@stomp/ng2-stompjs";

@Injectable({
  providedIn: 'root'
})
export class ControlPanelService {

  constructor(private rxStompService: RxStompService) {
  }

  send(command: MpdCommands | null) {
    console.log("Sending command:", command);
    if (command) {
      this.rxStompService.publish({
        destination: "/app/control-panel",
        body: JSON.stringify(command)
      });
    }
  }
}
