import { Injectable } from "@angular/core";
import { WebSocketService } from "./web-socket.service";
import { StateMsgPayload } from "../messages/incoming/state-msg-payload";
import { ControlPanel } from "../messages/incoming/control-panel";
import { QueueTrack } from "../models/queue-track";
import { ConnConfUtil } from "../conn-conf/conn-conf-util";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { filter } from "rxjs/internal/operators";
import { PlaylistSaved } from "../messages/incoming/playlist-saved";
import { HttpClient } from "@angular/common/http";
import { PlaylistInfo } from "../models/playlist-info";

@Injectable({
  providedIn: "root",
})
export class MpdService {
  private controlPanel = new Subject<ControlPanel>();
  private currentSong = new Subject<QueueTrack>();
  private currentState = new Subject<string>();
  private playlistSaved = new Subject<PlaylistSaved>();
  private prevSong = new QueueTrack();
  private volume = new Subject<number>();

  constructor(
    private webSocketService: WebSocketService,
    private http: HttpClient
  ) {
    this.init();
  }

  getSongSubscription(): Observable<QueueTrack> {
    return this.currentSong.asObservable();
  }

  getStateSubscription(): Observable<string> {
    return this.currentState.asObservable();
  }

  getControlPanelSubscription(): Observable<ControlPanel> {
    return this.controlPanel.asObservable();
  }

  getVolumeSubscription(): Observable<number> {
    return this.volume.asObservable();
  }

  getPlaylistSavedSubscription(): Observable<PlaylistSaved> {
    return this.playlistSaved.asObservable();
  }

  getPlaylistInfo(playlistName: string): Observable<PlaylistInfo> {
    const backendAddr = ConnConfUtil.getBackendAddr();
    const url = `${backendAddr}/api/playlist/${playlistName}`;
    return this.http.get<PlaylistInfo>(url);
  }

  /**
   * Build the currentSong object - holds info about the song currently played
   * @param payload IStateMsgPayload
   */
  private buildState(payload: StateMsgPayload) {
    this.controlPanel.next(payload.controlPanel);
    this.currentState.next(payload.serverStatus.state);
    this.volume.next(payload.serverStatus.volume);
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

  private buildQueueTrack(payload: StateMsgPayload, songChanged: boolean) {
    const queueTrack = new QueueTrack(payload.currentSong);
    queueTrack.coverUrl = this.buildCoverUrl(payload.currentSong.file);
    queueTrack.elapsed = payload.serverStatus.elapsedTime;
    queueTrack.progress = payload.serverStatus.elapsedTime;
    queueTrack.changed = songChanged;
    queueTrack.dir = this.buildDirForTrack(payload.currentSong.file);
    return queueTrack;
  }

  private buildCoverUrl(file: string) {
    return `${ConnConfUtil.getFindTrackCoverUrl()}?path=${encodeURIComponent(
      file
    )}`;
  }

  private init() {
    this.buildStateSubscription();
    this.buildPlaylistSavedSubscription();
  }

  private buildStateSubscription() {
    this.webSocketService
      .getStateSubscription()
      .pipe(
        map((msg) => this.buildState(msg)),
        filter((queueTrack: QueueTrack) => !!queueTrack)
      )
      .subscribe((queueTrack) => this.currentSong.next(queueTrack));
  }

  private buildPlaylistSavedSubscription() {
    this.webSocketService
      .getPlaylistSavedSubscription()
      .subscribe((msg) => this.playlistSaved.next(msg));
  }

  private buildDirForTrack(file: string) {
    const splitted = file.split("/");
    const ret = splitted.slice(0, splitted.length - 1);
    return ret.join("/");
  }
}
