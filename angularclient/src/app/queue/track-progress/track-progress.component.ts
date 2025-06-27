import { Component, inject } from "@angular/core";
import { Observable, delay, startWith } from "rxjs";
import { ControlPanelService } from "../../service/control-panel.service";
import { MpdService } from "../../service/mpd.service";
import { QueueTrack } from "../../shared/model/queue-track";
import { NgIf, AsyncPipe } from "@angular/common";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";
import { SecondsToMmSsPipe } from "../../shared/pipes/seconds-to-mm-ss.pipe";

@Component({
  selector: "app-track-progress",
  templateUrl: "./track-progress.component.html",
  styleUrls: ["./track-progress.component.scss"],
  imports: [
    NgIf,
    MatSlider,
    MatSliderThumb,
    FormsModule,
    AsyncPipe,
    SecondsToMmSsPipe,
  ],
})
export class TrackProgressComponent {
  private controlPanelService = inject(ControlPanelService);
  private mpdService = inject(MpdService);

  isStream$: Observable<boolean>;
  connected$: Observable<boolean>;
  track$: Observable<QueueTrack>;
  state$: Observable<string>;

  constructor() {
    this.connected$ = this.mpdService.isConnected$();
    this.state$ = this.mpdService.currentState$;
    this.track$ = this.mpdService.currentTrack$.pipe(
      startWith(new QueueTrack()),
    );
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
      "",
    );
  }
}
