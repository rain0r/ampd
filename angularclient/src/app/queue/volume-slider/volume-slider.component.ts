import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { MpdService } from "../../shared/services/mpd.service";
import { ControlPanelService } from "../../shared/services/control-panel.service";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
})
export class VolumeSliderComponent {
  volume = 0;

  constructor(
    private controlPanelService: ControlPanelService,
    private mpdService: MpdService
  ) {
    mpdService.volume.subscribe((volume) => (this.volume = volume));
  }

  handleVolumeSlider(event: MatSliderChange): void {
    this.controlPanelService.setVolume(event.value);
    event.source.blur();
  }
}
