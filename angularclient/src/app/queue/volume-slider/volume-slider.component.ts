import { Component } from "@angular/core";

import { Observable } from "rxjs";
import { MpdService } from "src/app/service/mpd.service";
import { VolumeService } from "../../service/volume.service";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
})
export class VolumeSliderComponent {
  volume = 0;
  connected$: Observable<boolean>;
  state$: Observable<string>;

  constructor(
    private mpdService: MpdService,
    private volumeService: VolumeService
  ) {
    volumeService.volume.subscribe((volume) => (this.volume = volume));
    this.connected$ = this.mpdService.isConnected$();
    this.state$ = this.mpdService.currentState$;
  }

  handleVolumeSlider(value: number): void {
    this.volume = value;
    this.volumeService.setVolume(value);
  }
}
