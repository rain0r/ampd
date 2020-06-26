import { Component, HostListener, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { UPDATE_COVER } from "../shared/commands/internal";
import { IControlPanel } from "../shared/messages/incoming/control-panel";
import { IStateMsgPayload } from "../shared/messages/incoming/state-msg-payload";

import { MpdCommands } from "../shared/mpd/mpd-commands";
import { MessageService } from "../shared/services/message.service";
import { WebSocketService } from "../shared/services/web-socket.service";
import { QueueTrack } from "../shared/models/queue-track";
import { ConnConfUtil } from "../shared/conn-conf/conn-conf-util";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
})
export class QueueComponent implements OnInit {
  controlPanel: IControlPanel;
  currentSong: QueueTrack;
  volume = 0;
  currentState = "";
  private stateSubs: Observable<IStateMsgPayload>;

  constructor(
    private webSocketService: WebSocketService,
    private messageService: MessageService
  ) {
    this.stateSubs = this.webSocketService.getStateSubscription();
    this.stateSubs.subscribe((message: IStateMsgPayload) =>
      this.buildState(message)
    );
  }

  @HostListener("document:visibilitychange", ["$event"])
  onKeyUp(): void {
    if (document.visibilityState === "visible") {
      this.webSocketService.send(MpdCommands.GET_QUEUE);
    }
  }

  getFormattedElapsedTime(elapsedTime: number): string {
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    const elapsedSeconds = elapsedTime - elapsedMinutes * 60;
    return `${elapsedMinutes}:${
      elapsedSeconds < 10 ? "0" : ""
    }${elapsedSeconds}`;
  }

  ngOnInit(): void {
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  showProgress(): boolean {
    return (
      this.currentSong &&
      this.currentSong.mpdTrack.length > 0 &&
      this.currentSong.progress >= 0
    );
  }

  showVolumeSlider(): boolean {
    return this.currentSong && this.volume >= 0 && this.volume <= 100;
  }

  showMpdModes(): boolean {
    return !!this.controlPanel && !!this.currentState;
  }

  showQueueHeader() {
    return !!this.currentSong && !!this.currentState;
  }

  private buildState(payload: IStateMsgPayload) {
    if (!!payload || !!payload.currentSong) {
      return;
    }

    // Build the currentSong object - holds info about the song currently played
    const queueTrack = this.buildQueueTrack(payload);

    this.controlPanel = payload.controlPanel;
    this.currentState = payload.serverStatus.state;
    this.volume = payload.serverStatus.volume;
    this.currentSong = queueTrack;

    this.messageService.sendMessage(UPDATE_COVER);
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  private buildCoverUrl(title: string) {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const currentCoverUrl = "current-cover";
    // Add a query param to trigger an image change in the browser
    return `${backendAddr}/${currentCoverUrl}?title=${encodeURIComponent(
      title
    )}`;
  }

  private buildQueueTrack(payload: IStateMsgPayload) {
    const queueTrack = new QueueTrack(payload.currentSong);
    queueTrack.coverUrl = this.buildCoverUrl(payload.currentSong.title);
    queueTrack.elapsedFormatted = this.getFormattedElapsedTime(
      payload.serverStatus.elapsedTime
    );
    queueTrack.progress = payload.serverStatus.elapsedTime;
    return queueTrack;
  }
}
