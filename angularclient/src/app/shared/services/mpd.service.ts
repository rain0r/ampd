import { Injectable } from "@angular/core";
import { WebSocketService } from "./web-socket.service";
import { IStateMsgPayload } from "../messages/incoming/state-msg-payload";
import { IControlPanel } from "../messages/incoming/control-panel";
import { QueueTrack } from "../models/queue-track";
import { ConnConfUtil } from "../conn-conf/conn-conf-util";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class MpdService {
  private controlPanel: IControlPanel;
  private volume = 0;
  private currentState = new Subject<string>();
  private prevSong = new QueueTrack();
  private currentSong = new Subject<QueueTrack>();

  constructor(private webSocketService: WebSocketService) {
    this.init();
  }

  getSongSubscription(): Observable<QueueTrack> {
    return this.currentSong.asObservable();
  }

  getStateSubscription(): Observable<string> {
    return this.currentState.asObservable();
  }

  /**
   * Build the currentSong object - holds info about the song currently played
   * @param payload IStateMsgPayload
   */
  private buildState(payload: IStateMsgPayload) {
    this.controlPanel = payload.controlPanel;
    this.currentState.next(payload.serverStatus.state);
    this.volume = payload.serverStatus.volume;
    let songChanged = false;
    if (payload.currentSong) {
      if (this.prevSong && this.prevSong.id) {
        if (payload.currentSong.id !== this.prevSong.id) {
          songChanged = true;
        }
      }
      const prevSong = this.buildQueueTrack(payload, songChanged);
      this.prevSong = prevSong;
      return prevSong;
    }
  }

  private buildQueueTrack(payload: IStateMsgPayload, songChanged: boolean) {
    const queueTrack = new QueueTrack(payload.currentSong);
    queueTrack.coverUrl = this.buildCoverUrl(payload.currentSong.title);
    queueTrack.elapsed = payload.serverStatus.elapsedTime;
    queueTrack.progress = payload.serverStatus.elapsedTime;
    queueTrack.changed = songChanged;
    return queueTrack;
  }

  private buildCoverUrl(title: string) {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const currentCoverUrl = "current-cover";
    // Add a query param to trigger an image change in the browser
    return `${backendAddr}/${currentCoverUrl}?title=${encodeURIComponent(
      title
    )}`;
  }

  private init() {
    this.webSocketService
      .getStateSubscription()
      .pipe(map((msg) => this.buildState(msg)))
      .subscribe((queueTrack) => this.currentSong.next(queueTrack));
  }
}
