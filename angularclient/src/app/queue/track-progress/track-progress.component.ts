import { Component, Input } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdCommands } from "../../shared/mpd/mpd-commands";
import { WebSocketService } from "../../shared/services/web-socket.service";

@Component({
  selector: "app-track-progress",
  templateUrl: "./track-progress.component.html",
  styleUrls: ["./track-progress.component.scss"],
})
export class TrackProgressComponent {
  @Input() currentSong: QueueTrack = new QueueTrack();

  constructor(private webSocketService: WebSocketService) {}

  handleCurrentSongProgressSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_SEEK, {
      value: event.value,
    });
  }
}
