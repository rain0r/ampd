import {Injectable} from '@angular/core';
import {MpdCommands} from "../mpd/mpd-commands.enum";
import {WebSocketService} from "./web-socket.service";
import {RxStompService} from "@stomp/ng2-stompjs";

@Injectable({
  providedIn: 'root'
})
export class ControlPanelService {

  constructor(private webSocketService: WebSocketService,
              private rxStompService: RxStompService) {
  }

  send(command: MpdCommands | null) {
    if (command) {
      this.rxStompService.publish({
        destination: "/app/control-panel",
        body: JSON.stringify(command)
      });
    }
  }
}
