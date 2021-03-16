import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { Observable } from "rxjs";
import { ControlPanelService } from "../../shared/services/control-panel.service";

@Component({
  selector: "app-track-progress",
  templateUrl: "./track-progress.component.html",
  styleUrls: ["./track-progress.component.scss"],
})
export class TrackProgressComponent {
  currentTrack: Observable<QueueTrack>;
  state: Observable<string>;

  constructor(
    private mpdService: MpdService,
    private controlPanelService: ControlPanelService
  ) {
    this.currentTrack = this.mpdService.currentTrack;
    this.state = this.mpdService.currentState;
  }

  handleCurrentTrackProgressSlider(event: MatSliderChange): void {
    this.controlPanelService.seek(event.value);
  }
}
