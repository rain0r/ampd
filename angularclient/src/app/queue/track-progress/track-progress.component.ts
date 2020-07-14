import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { Observable } from "rxjs";
import { MpdCommands } from "../../shared/mpd/mpd-commands.enum";

@Component({
  selector: "app-track-progress",
  templateUrl: "./track-progress.component.html",
  styleUrls: ["./track-progress.component.scss"],
})
export class TrackProgressComponent {
  currentSong: QueueTrack = new QueueTrack();
  state: Observable<string>;

  constructor(
    private webSocketService: WebSocketService,
    private mpdService: MpdService
  ) {
    this.mpdService
      .getSongSubscription()
      .subscribe((song) => (this.currentSong = song));
    this.state = this.mpdService.getStateSubscription();
  }

  handleCurrentSongProgressSlider(event: MatSliderChange): void {
    this.webSocketService.sendData(MpdCommands.SET_SEEK, {
      value: event.value,
    });
  }
}
