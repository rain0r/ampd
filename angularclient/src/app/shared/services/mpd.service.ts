import { Injectable } from "@angular/core";
import { StateMsgPayload } from "../messages/incoming/state-msg-payload";
import { MpdModesPanel } from "../messages/incoming/mpd-modes-panel";
import { QueueTrack } from "../models/queue-track";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, filter, map, tap } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { QueueService } from "./queue.service";
import { ControlPanelService } from "./control-panel.service";
import { RxStompService } from "@stomp/ng2-stompjs";
import { ServerStatistics } from "../models/server-statistics";
import { ErrorMsg } from "../error/error-msg";

@Injectable({
  providedIn: "root",
})
export class MpdService {
  currentTrack: Observable<QueueTrack>;
  currentState: Observable<string>;
  mpdModesPanel: Observable<MpdModesPanel>;

  private mpdModesPanel$ = new Subject<MpdModesPanel>();
  private currentTrack$ = new Subject<QueueTrack>();
  private currentState$ = new Subject<string>();
  private prevTrack = new QueueTrack();

  constructor(
    private controlPanelService: ControlPanelService,
    private http: HttpClient,
    private queueService: QueueService,
    private rxStompService: RxStompService,
    private settingsService: SettingsService
  ) {
    this.buildStateSubscription();
    this.mpdModesPanel = this.mpdModesPanel$.asObservable();
    this.currentTrack = this.currentTrack$.asObservable();
    this.currentState = this.currentState$.asObservable();
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

  buildCoverUrl(file: string): string {
    const url = `${this.settingsService.getBackendContextAddr()}api/find-track-cover`;
    return `${url}?path=${encodeURIComponent(file)}`;
  }

  updateDatabase(): Observable<void> {
    const url = `${this.settingsService.getBackendContextAddr()}api/update-database`;
    return this.http.post<void>(url, {});
  }

  rescanDatabase(): Observable<void> {
    const url = `${this.settingsService.getBackendContextAddr()}api/rescan-database`;
    return this.http.post<void>(url, {});
  }

  getServerStatistics(): Observable<ServerStatistics> {
    const url = `${this.settingsService.getBackendContextAddr()}api/server-statistics`;
    return this.http.get<ServerStatistics>(url).pipe(
      catchError((err: HttpErrorResponse) =>
        throwError({
          title: `Got an error retrieving the server statistics:`,
          detail: err.message,
        } as ErrorMsg)
      )
    );
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

  private buildStateSubscription(): void {
    this.getStateSubscription()
      .pipe(
        tap((payload) => {
          this.mpdModesPanel$.next(payload.mpdModesPanelMsg);
          this.currentState$.next(payload.serverStatus.state);
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

  /**
   * Strips the file name from the file path. This returns the directory that holds the tracks.
   * @param file
   */
  private buildDirForTrack(file: string): string {
    const splitted = file.split("/");
    const ret = splitted.slice(0, splitted.length - 1);
    return ret.join("/");
  }

  private getStateSubscription(): Observable<StateMsgPayload> {
    return this.rxStompService.watch("/topic/state").pipe(
      map((message) => message.body),
      map((body: string) => <StateMsgPayload>JSON.parse(body))
    );
  }
}
