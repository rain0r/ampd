import { Component } from "@angular/core";
import { Observable, delay } from "rxjs";
import { ControlPanelService } from "../../service/control-panel.service";
import { MpdService } from "../../service/mpd.service";
import { QueueTrack } from "../../shared/model/queue-track";

@Component({
  selector: "app-track-progress",
  templateUrl: "./track-progress.component.html",
  styleUrls: ["./track-progress.component.scss"],
})
export class TrackProgressComponent {
  isStream$: Observable<boolean>;
  connected$: Observable<boolean>;
  track = new QueueTrack();
  state$: Observable<string>;

  constructor(
    private controlPanelService: ControlPanelService,
    private mpdService: MpdService
  ) {
    this.connected$ = this.mpdService.isConnected$();
    this.state$ = this.mpdService.currentState$;
    this.mpdService.currentTrack$.subscribe((track) => (this.track = track));
    this.isStream$ = this.mpdService.isCurrentTrackRadioStream$();
  }

  handleCurrentTrackProgressSlider(seconds: number): void {
    this.controlPanelService.seek(seconds);
    // Prevent jumping back and forth
    this.state$.pipe(delay(500));
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
