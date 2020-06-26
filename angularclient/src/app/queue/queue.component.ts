import { Component, HostListener, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { UPDATE_COVER } from "../shared/commands/internal";
import { IControlPanel } from "../shared/messages/incoming/control-panel";
import { IStateMsgPayload } from "../shared/messages/incoming/state-msg-payload";

import { MpdCommands } from "../shared/mpd/mpd-commands";
import { MessageService } from "../shared/services/message.service";
import { WebSocketService } from "../shared/services/web-socket.service";
import { QueueTrack } from "../shared/models/queue-track";

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
    if (isNaN(this.currentSong.mpdTrack.length)) {
      return "";
    }
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    const elapsedSeconds = elapsedTime - elapsedMinutes * 60;
    return `${elapsedMinutes}:${
      elapsedSeconds < 10 ? "0" : ""
    }${elapsedSeconds}`;
  }

  ngOnInit(): void {
    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }

  private buildState(payload: IStateMsgPayload): void {
    // let callBuildQueue = false; // Determines if we need to update the queue
    const hasSongChanged = false;

    /* Call buildQueue once if there is no current track set */
    // if ("id" in this.currentSong) {
    //   if (
    //     payload.currentSong &&
    //     payload.currentSong.id !== this.currentSong.mpdTrack.id
    //   ) {
    //     hasSongChanged = true;
    //   }
    // } else {
    //   callBuildQueue = true;
    // }

    // Build the currentSong object - holds info about the song currently played
    this.currentSong = new QueueTrack(payload.currentSong);
    this.currentSong.elapsedFormatted = this.getFormattedElapsedTime(
      payload.serverStatus.elapsedTime
    );
    this.currentSong.progress = payload.serverStatus.elapsedTime;

    this.controlPanel = payload.controlPanel;
    this.currentState = payload.serverStatus.state;
    this.volume = payload.serverStatus.volume;

    if (hasSongChanged) {
      this.messageService.sendMessage(UPDATE_COVER);
    }

    this.webSocketService.send(MpdCommands.GET_QUEUE);
  }
}
