import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { VolumeService } from "../../shared/services/volume.service";

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
    if (event.value) {
      this.volume = event.value;
    }
    this.volumeService.setVolume(event.value);
    event.source.blur();
  }
}
