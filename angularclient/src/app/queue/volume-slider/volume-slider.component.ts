import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { MpdService } from "../../shared/services/mpd.service";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-volume-slider",
  templateUrl: "./volume-slider.component.html",
  styleUrls: ["./volume-slider.component.scss"],
})
export class VolumeSliderComponent {
  volume = -1;

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
