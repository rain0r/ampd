import { Component, inject } from "@angular/core";

import { Observable } from "rxjs";
import { MpdService } from "src/app/service/mpd.service";
import { VolumeService } from "../../service/volume.service";
import { AsyncPipe } from "@angular/common";
import { MatIcon } from "@angular/material/icon";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
  imports: [MatIcon, MatSlider, MatSliderThumb, FormsModule, AsyncPipe],
})
export class VolumeSliderComponent {
  private mpdService = inject(MpdService);
  private volumeService = inject(VolumeService);

  volume = 0;
  connected$: Observable<boolean>;
  state$: Observable<string>;

  constructor() {
    const volumeService = this.volumeService;

    volumeService.volume.subscribe((volume) => (this.volume = volume));
    this.connected$ = this.mpdService.isConnected$();
    this.state$ = this.mpdService.currentState$;
  }

  handleVolumeSlider(value: number): void {
    this.volume = value;
    this.volumeService.setVolume(value);
  }
}
