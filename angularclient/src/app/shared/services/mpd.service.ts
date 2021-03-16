import { Injectable } from "@angular/core";
import { StateMsgPayload } from "../messages/incoming/state-msg-payload";
import { MpdModesPanel } from "../messages/incoming/mpd-modes-panel";
import { QueueTrack } from "../models/queue-track";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import {
  bufferTime,
  catchError,
  filter,
  map,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { PlaylistSaved } from "../messages/incoming/playlist-saved";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { PlaylistInfo } from "../models/playlist-info";
import { SettingsService } from "./settings.service";
import { VolumeSetter } from "../models/volume-setter";
import { SavePlaylistResponse } from "../models/http/savePlaylistResponse";
import { ErrorMsg } from "../error/error-msg";
import { QueueService } from "./queue.service";
import { ControlPanelService } from "./control-panel.service";
import { BaseResponse } from "../messages/incoming/base-response";
import { MpdTypes } from "../mpd/mpd-types";
import { RxStompService } from "@stomp/ng2-stompjs";

@Injectable({
  providedIn: "root",
})
export class MpdService {
  controlPanel: Observable<MpdModesPanel>;
  currentTrack: Observable<QueueTrack>;
  currentState: Observable<string>;
  playlistSaved: Observable<PlaylistSaved>;
  volume: Observable<number>;
  volumeSetter: Observable<VolumeSetter>;

  private controlPanel$ = new Subject<MpdModesPanel>();
  private currentTrack$ = new Subject<QueueTrack>();
  private currentState$ = new Subject<string>();
  private playlistSaved$ = new Subject<PlaylistSaved>();
  private prevTrack = new QueueTrack();
  private volume$ = new BehaviorSubject<number>(0);
  private volumeSetter$ = new Subject<VolumeSetter>();

  constructor(
    private controlPanelService: ControlPanelService,
    private http: HttpClient,
    private queueService: QueueService,
    private rxStompService: RxStompService,
    private settingsService: SettingsService
  ) {
    this.init();
    this.controlPanel = this.controlPanel$.asObservable();
    this.currentTrack = this.currentTrack$.asObservable();
    this.currentState = this.currentState$.asObservable();
    this.playlistSaved = this.playlistSaved$.asObservable();
    this.volume = this.volume$.asObservable();
    this.volumeSetter = this.volumeSetter$.asObservable();
    this.buildVolumeSetter();
  }

  refreshQueue(): void {
    this.queueService.getQueue();
  }

  getPlaylistInfo(playlistName: string): Observable<PlaylistInfo> {
    const url = `${this.settingsService.getPlaylistRootUrl()}${playlistName}`;
    return this.http.get<PlaylistInfo>(url);
  }

  savePlaylist(playlistName: string): Observable<SavePlaylistResponse> {
    return this.http.post<SavePlaylistResponse>(
      this.settingsService.getPlaylistRootUrl(),
      { playlistName: playlistName }
    );
  }

  initEmptyControlPanel(): MpdModesPanel {
    return {
      random: false,
      consume: false,
      single: false,
      crossfade: false,
      repeat: false,
    } as MpdModesPanel;
  }

  decreaseVolume(): void {
    this.volumeSetter$.next({
      increase: false,
      step: 1,
    } as VolumeSetter);
  }

  increaseVolume(): void {
    this.volumeSetter$.next({
      increase: true,
      step: 1,
    } as VolumeSetter);
  }

  clearQueue(): void {
    this.queueService.removeAll();
    this.refreshQueue();
  }

  deletePlaylist(name: string): Observable<unknown> {
    const url = `${this.settingsService.getPlaylistRootUrl()}${name}`;
    return this.http.delete(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error deleteting playlist: ${name}:`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
  }

  buildCoverUrl(file: string): string {
    return `${this.settingsService.getFindTrackCoverUrl()}?path=${encodeURIComponent(
      file
    )}`;
  }

  /**
   * Build the currentTrack object - holds info about the track currently played
   * @param payload StateMsgPayload
   */
  private buildCurrentQueueTrack(payload: StateMsgPayload): QueueTrack {
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

  private init(): void {
    this.buildStateSubscription();
  }

  private buildStateSubscription(): void {
    this.getStateSubscription()
      .pipe(
        tap((payload) => {
          this.controlPanel$.next(payload.controlPanel);
          this.currentState$.next(payload.serverStatus.state);
          this.volume$.next(payload.serverStatus.volume);
        }),
        map((payload) => this.buildCurrentQueueTrack(payload)),
        filter(
          (queueTrack: QueueTrack) =>
            (queueTrack.artistName !== "" && queueTrack.title !== "") ||
            queueTrack.file !== ""
        )
      )
      .subscribe((queueTrack) => this.currentTrack$.next(queueTrack));
  }

  private buildDirForTrack(file: string): string {
    const splitted = file.split("/");
    const ret = splitted.slice(0, splitted.length - 1);
    return ret.join("/");
  }

  /**
   * Listen 500ms and sums up the keystrokes. Add the sum to the current volume.
   */
  private buildVolumeSetter(): void {
    const volInput = this.volumeSetter$.asObservable().pipe(
      bufferTime(500),
      filter((times) => times.length > 0)
    );
    volInput.pipe(withLatestFrom(this.volume)).subscribe(([times, volume]) => {
      const newVol = times[0].increase
        ? volume + times.length
        : volume - times.length;
      this.controlPanelService.setVolume(newVol);
    });
  }

  private getStateSubscription(): Observable<StateMsgPayload> {
    return this.rxStompService.watch("/topic/state").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => body !== null),
      filter((body: BaseResponse) => body.type === MpdTypes.STATE),
      map((body: BaseResponse) => <StateMsgPayload>body.payload)
    );
  }
}
