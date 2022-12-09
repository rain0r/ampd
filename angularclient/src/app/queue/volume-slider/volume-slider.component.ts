import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
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

  constructor(
    private mpdService: MpdService,
    private volumeService: VolumeService
  ) {
    volumeService.volume.subscribe((volume) => (this.volume = volume));
    this.connected$ = this.mpdService.isConnected$();
  }

  handleVolumeSlider(event: MatSliderChange): void {
    if (event.value) {
      this.volume = event.value;
    }
    this.volumeService.setVolume(event.value);
    event.source.blur();
  }
}
