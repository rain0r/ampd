import { Injectable } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";

@Injectable({
  providedIn: "root",
})
export class ControlPanelService {
  private path = "/control-panel/";

  constructor(private rxStompService: RxStompService) {}

  prev(): void {
    this.rxStompService.publish({
      destination: `${this.path}prev`,
    });
  }

  stop(): void {
    this.rxStompService.publish({
      destination: `${this.path}stop`,
    });
  }

  pause(): void {
    this.rxStompService.publish({
      destination: `${this.path}pause`,
    });
  }

  play(): void {
    this.rxStompService.publish({
      destination: `${this.path}play`,
    });
  }

  next(): void {
    this.rxStompService.publish({
      destination: `${this.path}next`,
    });
  }
}
