import { Injectable } from "@angular/core";
import { MpdModesPanel } from "../shared/messages/incoming/mpd-modes-panel";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";

@Injectable({
  providedIn: "root",
})
export class ControlPanelService {
  private path = "/app/control-panel/";

  constructor(private rxStompService: AmpdRxStompService) {}

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
