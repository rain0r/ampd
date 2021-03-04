import { Injectable } from "@angular/core";
import { WebSocketService } from "./web-socket.service";
import { StateMsgPayload } from "../messages/incoming/state-msg-payload";
import { ControlPanel } from "../messages/incoming/control-panel";
import { QueueTrack } from "../models/queue-track";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { PlaylistSaved } from "../messages/incoming/playlist-saved";
import { HttpClient } from "@angular/common/http";
import { PlaylistInfo } from "../models/playlist-info";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class MpdService {
  controlPanel: Observable<ControlPanel>;
  currentTrack: Observable<QueueTrack>;
  currentState: Observable<string>;
  playlistSaved: Observable<PlaylistSaved>;
  volume: Observable<number>;

  private controlPanel$ = new Subject<ControlPanel>();
  private currentTrack$ = new Subject<QueueTrack>();
  private currentState$ = new Subject<string>();
  private playlistSaved$ = new Subject<PlaylistSaved>();
  private prevTrack = new QueueTrack();
  private volume$ = new Subject<number>();

  constructor(
    private webSocketService: WebSocketService,
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.init();
    this.controlPanel = this.controlPanel$.asObservable();
    this.currentTrack = this.currentTrack$.asObservable();
    this.currentState = this.currentState$.asObservable();
    this.playlistSaved = this.playlistSaved$.asObservable();
    this.volume = this.volume$.asObservable();
  }

  getPlaylistInfo(playlistName: string): Observable<PlaylistInfo> {
    return this.http.get<PlaylistInfo>(
      this.settingsService.getPlaylistInfoUrl(playlistName)
    );
  }

  /**
   * Build the currentTrack object - holds info about the track currently played
   * @param payload IStateMsgPayload
   */
  private buildState(payload: StateMsgPayload): QueueTrack {
    this.controlPanel$.next(payload.controlPanel);
    this.currentState$.next(payload.serverStatus.state);
    this.volume$.next(payload.serverStatus.volume);
    let trackChanged = false;
    let track = new QueueTrack();
    if (payload.currentTrack) {
      if (this.prevTrack && this.prevTrack.id) {
        if (payload.currentTrack.id !== this.prevTrack.id) {
          trackChanged = true;
        }
      }
      track = this.buildQueueTrack(payload, trackChanged);
      this.prevTrack = track;
    }
    return track;
  }

  private buildQueueTrack(
    payload: StateMsgPayload,
    trackChanged: boolean
  ): QueueTrack {
    const queueTrack = new QueueTrack(payload.currentTrack);
    queueTrack.coverUrl = this.buildCoverUrl(payload.currentTrack.file);
    queueTrack.elapsed = payload.serverStatus.elapsedTime;
    queueTrack.progress = payload.serverStatus.elapsedTime;
    queueTrack.changed = trackChanged;
    queueTrack.dir = this.buildDirForTrack(payload.currentTrack.file);
    return queueTrack;
  }

  private buildCoverUrl(file: string): string {
    return `${this.settingsService.getFindTrackCoverUrl()}?path=${encodeURIComponent(
      file
    )}`;
  }

  private init(): void {
    this.buildStateSubscription();
    this.buildPlaylistSavedSubscription();
  }

  private buildStateSubscription(): void {
    this.webSocketService
      .getStateSubscription()
      .pipe(
        map((msg) => this.buildState(msg)),
        filter((queueTrack: QueueTrack) => !!queueTrack)
      )
      .subscribe((queueTrack) => this.currentTrack$.next(queueTrack));
  }

  private buildPlaylistSavedSubscription(): void {
    this.webSocketService
      .getPlaylistSavedSubscription()
      .subscribe((msg) => this.playlistSaved$.next(msg));
  }

  private buildDirForTrack(file: string): string {
    const splitted = file.split("/");
    const ret = splitted.slice(0, splitted.length - 1);
    return ret.join("/");
  }
}
