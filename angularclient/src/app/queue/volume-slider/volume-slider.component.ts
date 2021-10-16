import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { VolumeService } from "../../shared/services/volume.service";
import { delay } from "rxjs/operators";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
})
export class VolumeSliderComponent {
  volume = 0;

  constructor(private volumeService: VolumeService) {
    volumeService.volume.subscribe((volume) => (this.volume = volume));
  }

  handleVolumeSlider(event: MatSliderChange): void {
    this.volumeService.setVolume(event.value);
    this.volumeService.volume.pipe(delay(1200));
    event.source.blur();
  }
}
