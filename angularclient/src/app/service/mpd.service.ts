import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { RxStompState } from "@stomp/rx-stomp";
import objectHash from "object-hash";
import { Observable } from "rxjs";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
import { MpdModesPanel } from "../shared/messages/incoming/mpd-modes-panel";
import { StateMsgPayload } from "../shared/messages/incoming/state-msg-payload";
import { QueueTrack } from "../shared/model/queue-track";
import { ServerStatistics } from "../shared/model/server-statistics";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";
import { QueueService } from "./queue.service";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn: "root",
})
export class MpdService {
  private http = inject(HttpClient);
  private rxStompService = inject(AmpdRxStompService);
  private settingsService = inject(SettingsService);
  private queueService = inject(QueueService);

  currentTrack$: Observable<QueueTrack>;
  currentState$: Observable<string>;
  mpdModesPanel$: Observable<MpdModesPanel>;
  state$: Observable<StateMsgPayload>;
  signals$: Observable<string>;

  constructor() {
    this.state$ = this.getStateSubscription$();
    this.signals$ = this.getSignalsSubscription$();

    this.currentTrack$ = this.state$.pipe(
      map((payload) => this.buildCurrentQueueTrack(payload)),
      filter(
        (queueTrack: QueueTrack) =>
          (queueTrack.artistName !== "" && queueTrack.title !== "") ||
          queueTrack.file !== "",
      ),
    );
    this.mpdModesPanel$ = this.state$.pipe(
      map((state) => state.mpdModesPanelMsg),
    );
    this.currentState$ = this.state$.pipe(
      map((state) => state.serverStatus.state),
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

  buildCoverUrl(file: string): string {
    const url = `${this.settingsService.getBackendContextAddr()}api/find-track-cover`;
    return `${url}?path=${encodeURIComponent(file)}`;
  }

  updateDatabase$(): Observable<void> {
    const url = `${this.settingsService.getBackendContextAddr()}api/update-database`;
    return this.http.post<void>(url, {});
  }

  rescanDatabase$(): Observable<void> {
    const url = `${this.settingsService.getBackendContextAddr()}api/rescan-database`;
    return this.http.post<void>(url, {});
  }

  getServerStatistics$(): Observable<ServerStatistics> {
    const url = `${this.settingsService.getBackendContextAddr()}api/server-statistics`;
    return this.http.get<ServerStatistics>(url);
  }

  getQueueTrackCount$(): Observable<number> {
    return this.queueService.queue$.pipe(
      map((tracks) => tracks.content.length),
    );
  }

  isCurrentTrackRadioStream$(): Observable<boolean> {
    const re = new RegExp("^(http|https)://", "i");
    return this.currentTrack$.pipe(map((track) => re.test(track.file)));
  }

  isConnected$(): Observable<boolean> {
    return this.rxStompService.connectionState$.pipe(
      map((state) => state === RxStompState.OPEN),
    );
  }

  /**
   * Build the currentTrack object - holds info about the track currently played
   * @param payload StateMsgPayload
   */
  private buildCurrentQueueTrack(payload: StateMsgPayload): QueueTrack {
    let track = new QueueTrack();
    if (payload.currentTrack) {
      track = this.buildQueueTrack(payload);
    }
    return track;
  }

  private buildQueueTrack(payload: StateMsgPayload): QueueTrack {
    const queueTrack = new QueueTrack(payload.currentTrack);
    queueTrack.coverUrl = this.buildCoverUrl(payload.currentTrack.file);
    queueTrack.elapsed = payload.serverStatus.elapsedTime;
    queueTrack.progress = payload.serverStatus.elapsedTime;
    queueTrack.dir = this.buildDirForTrack(payload.currentTrack.file);
    return queueTrack;
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

  private getStateSubscription$(): Observable<StateMsgPayload> {
    return this.rxStompService.watch("/topic/state").pipe(
      map((message) => message.body),
      map((body: string) => JSON.parse(body) as StateMsgPayload),
      distinctUntilChanged(
        (prev, curr) =>
          objectHash(prev, { algorithm: "md5" }) ===
          objectHash(curr, { algorithm: "md5" }),
      ),
    );
  }

  private getSignalsSubscription$(): Observable<string> {
    return this.rxStompService
      .watch("/topic/signals")
      .pipe(map((message) => message.body));
  }
}
