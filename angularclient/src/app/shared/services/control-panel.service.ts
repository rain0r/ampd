import { Injectable } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { MpdModesPanel } from "../messages/incoming/mpd-modes-panel";

@Injectable({
  providedIn: "root",
})
export class ControlPanelService {
  private path = "/app/control-panel/";

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

  seek(position: number | null): void {
    if (position) {
      this.rxStompService.publish({
        destination: `${this.path}seek`,
        body: JSON.stringify(position),
      });
    }
  }

  toggleMpdModes(mpdModesPanel: MpdModesPanel): void {
    this.rxStompService.publish({
      destination: `${this.path}mpd-modes-panel`,
      body: JSON.stringify(mpdModesPanel),
    });
  }
}
