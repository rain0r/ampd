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
  currentSong: Observable<QueueTrack>;
  currentState: Observable<string>;
  playlistSaved: Observable<PlaylistSaved>;
  volume: Observable<number>;

  private controlPanelSubject = new Subject<ControlPanel>();
  private currentSongSubject = new Subject<QueueTrack>();
  private currentStateSubject = new Subject<string>();
  private playlistSavedSubject = new Subject<PlaylistSaved>();
  private prevSong = new QueueTrack();
  private volumeSubject = new Subject<number>();

  constructor(
    private webSocketService: WebSocketService,
    private http: HttpClient,
    private settingsService: SettingsService
  ) {
    this.init();
    this.controlPanel = this.controlPanelSubject.asObservable();
    this.currentSong = this.currentSongSubject.asObservable();
    this.currentState = this.currentStateSubject.asObservable();
    this.playlistSaved = this.playlistSavedSubject.asObservable();
    this.volume = this.volumeSubject.asObservable();
  }

  getPlaylistInfo(playlistName: string): Observable<PlaylistInfo> {
    return this.http.get<PlaylistInfo>(
      this.settingsService.getPlaylistInfoUrl(playlistName)
    );
  }

  /**
   * Build the currentSong object - holds info about the song currently played
   * @param payload IStateMsgPayload
   */
  private buildState(payload: StateMsgPayload) {
    this.controlPanelSubject.next(payload.controlPanel);
    this.currentStateSubject.next(payload.serverStatus.state);
    this.volumeSubject.next(payload.serverStatus.volume);
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
    return `${this.settingsService.getFindTrackCoverUrl()}?path=${encodeURIComponent(
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
      .subscribe((queueTrack) => this.currentSongSubject.next(queueTrack));
  }

  private buildPlaylistSavedSubscription() {
    this.webSocketService
      .getPlaylistSavedSubscription()
      .subscribe((msg) => this.playlistSavedSubject.next(msg));
  }

  private buildDirForTrack(file: string) {
    const splitted = file.split("/");
    const ret = splitted.slice(0, splitted.length - 1);
    return ret.join("/");
  }
}
