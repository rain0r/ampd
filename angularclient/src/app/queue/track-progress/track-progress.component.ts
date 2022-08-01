import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { delay, Observable } from "rxjs";
import { ControlPanelService } from "../../service/control-panel.service";
import { MpdService } from "../../service/mpd.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { AmpdRxStompService } from "./../../service/ampd-rx-stomp.service";

@Component({
  selector: "app-track-progress",
  templateUrl: "./track-progress.component.html",
  styleUrls: ["./track-progress.component.scss"],
})
export class TrackProgressComponent {
  connState: Observable<number>;
  track = new QueueTrack();
  state: Observable<string>;

  constructor(
    private mpdService: MpdService,
    private controlPanelService: ControlPanelService,
    private rxStompService: AmpdRxStompService
  ) {
    this.state = this.mpdService.currentState;
    this.connState = this.rxStompService.connectionState$;
    this.mpdService.currentTrack.subscribe((track) => (this.track = track));
  }

  handleCurrentTrackProgressSlider(event: MatSliderChange): void {
    this.controlPanelService.seek(event.value);
    // Prevent jumping back and forth
    this.state.pipe(delay(500));
  }

  formatSeconds(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value - minutes * 60;
    return `${minutes}  :  ${seconds < 10 ? "0" : ""} ${seconds}`.replace(
      / /g,
      ""
    );
  }
}
