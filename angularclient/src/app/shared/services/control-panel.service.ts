import {Injectable} from '@angular/core';
import {RxStompService} from "@stomp/ng2-stompjs";

@Injectable({
  providedIn: 'root'
})
export class ControlPanelService {

  private path = "/control-panel/";

  constructor(private rxStompService: RxStompService) {
  }

  prev() {
    this.rxStompService.publish({
      destination: `${this.path}prev`,
    });
  }

  stop() {
    this.rxStompService.publish({
      destination: `${this.path}stop`,
    });
  }

  pause() {
    this.rxStompService.publish({
      destination: `${this.path}pause`,
    });
  }

  play() {
    this.rxStompService.publish({
      destination: `${this.path}play`,
    });
  }

  next() {
    this.rxStompService.publish({
      destination: `${this.path}next`,
    });
  }

}
