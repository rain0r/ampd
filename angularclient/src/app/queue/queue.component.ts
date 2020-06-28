import { Component, HostListener, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { IControlPanel } from "../shared/messages/incoming/control-panel";
import { IStateMsgPayload } from "../shared/messages/incoming/state-msg-payload";
import { MpdCommands } from "../shared/mpd/mpd-commands";
import { MessageService } from "../shared/services/message.service";
import { WebSocketService } from "../shared/services/web-socket.service";
import { QueueTrack } from "../shared/models/queue-track";
import { ConnConfUtil } from "../shared/conn-conf/conn-conf-util";
import { InternalMessageType } from "../shared/messages/internal/internal-message-type.enum";

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

  /**
   * Build the currentSong object - holds info about the song currently played
   * @param payload IStateMsgPayload
   */
  private buildState(payload: IStateMsgPayload) {
    this.controlPanel = payload.controlPanel;
    this.currentState = payload.serverStatus.state;
    this.volume = payload.serverStatus.volume;
    if (payload.currentSong) {
      this.currentSong = this.buildQueueTrack(payload);
      this.updateCover(payload);
    }
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
    queueTrack.elapsed = payload.serverStatus.elapsedTime;
    queueTrack.progress = payload.serverStatus.elapsedTime;
    return queueTrack;
  }

  private updateCover(payload: IStateMsgPayload) {
    if (payload.currentSong.id !== this.currentSong.id) {
      this.messageService.sendMessage(InternalMessageType.UpdateCover);
    }
  }
}
