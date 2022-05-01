import { RxStompService } from "@stomp/ng2-stompjs";
import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { VolumeService } from "../../shared/services/volume.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
})
export class VolumeSliderComponent {
  volume = 0;
  connState: Observable<number>;

  constructor(
    private volumeService: VolumeService,
    private rxStompService: RxStompService
  ) {
    volumeService.volume.subscribe((volume) => (this.volume = volume));
    this.connState = this.rxStompService.connectionState$;
  }

  handleVolumeSlider(event: MatSliderChange): void {
    if (event.value) {
      this.volume = event.value;
    }
    this.volumeService.setVolume(event.value);
    event.source.blur();
  }
}
