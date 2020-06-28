import { Component, HostListener, OnInit } from "@angular/core";
import { IControlPanel } from "../shared/messages/incoming/control-panel";
import { MpdCommands } from "../shared/mpd/mpd-commands";
import { WebSocketService } from "../shared/services/web-socket.service";
import { QueueTrack } from "../shared/models/queue-track";
import { MpdService } from "../shared/services/mpd.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
})
export class QueueComponent implements OnInit {
  controlPanel: IControlPanel;
  currentSong: QueueTrack = new QueueTrack();
  volume = 0;
  currentState = "";

  constructor(
    private webSocketService: WebSocketService,
    private mpdService: MpdService
  ) {
    this.getSongSubscription();
  }

  @HostListener("document:visibilitychange", ["$event"])
  onKeyUp(): void {
    if (document.visibilityState === "visible") {
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
  }

  ngOnInit(): void {
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  showProgress(): boolean {
    return (
      this.currentSong &&
      this.currentSong.length > 0 &&
      this.currentSong.progress >= 0
    );
  }

  showVolumeSlider(): boolean {
    return this.currentSong && this.volume >= 0 && this.volume <= 100;
  }

  showMpdModes(): boolean {
    return !!this.controlPanel && !!this.currentState;
  }

  private buildStateReceiver() {
    this.mpdService.getSongSubscription();
  }

  private getSongSubscription() {
    this.mpdService
      .getSongSubscription()
      .subscribe((queueTrack) => (this.currentSong = queueTrack));
  }
}
