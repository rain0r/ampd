import { Component, Renderer2 } from "@angular/core";
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
  volume = 0;

  constructor(
    private mpdService: MpdService,
    private renderer: Renderer2,
    private webSocketService: WebSocketService
  ) {
    mpdService.volume.subscribe((volume) => (this.volume = volume));
  }

  handleVolumeSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_VOLUME, {
      value: event.value,
    });
    event.source.blur();
  }
}
