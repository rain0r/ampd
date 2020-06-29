import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { MpdService } from "../../shared/services/mpd.service";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
})
export class VolumeSliderComponent {
  volume: number;

  constructor(
    private webSocketService: WebSocketService,
    private mpdService: MpdService
  ) {
    mpdService
      .getVolumeSubscription()
      .subscribe((volume) => (this.volume = volume));
  }

  handleVolumeSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_VOLUME, {
      value: event.value,
    });
  }
}
