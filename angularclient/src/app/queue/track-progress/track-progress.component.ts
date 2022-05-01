import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { RxStompService } from "@stomp/ng2-stompjs";
import { Observable } from "rxjs";
import { QueueTrack } from "../../shared/models/queue-track";
import { ControlPanelService } from "../../shared/services/control-panel.service";
import { MpdService } from "../../shared/services/mpd.service";

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
    private rxStompService: RxStompService
  ) {
    this.state = this.mpdService.currentState;
    this.connState = this.rxStompService.connectionState$;
    this.mpdService.currentTrack.subscribe((track) => (this.track = track));
  }

  handleCurrentTrackProgressSlider(event: MatSliderChange): void {
    this.controlPanelService.seek(event.value);
  }
}
