import { Injectable } from "@angular/core";
import { filter, map } from "rxjs/internal/operators";

import { RxStompService } from "@stomp/ng2-stompjs";
import { BaseResponse } from "../messages/incoming/base-response";
import { MpdTypes } from "../mpd/mpd-types";
import { Observable } from "rxjs";
import { StateMsgPayload } from "../messages/incoming/state-msg-payload";
import { BrowseMsgPayload } from "../messages/incoming/browse";
import { SearchMsgPayload, SearchRoot } from "../messages/incoming/search";
import { QueuePayload } from "../messages/incoming/queue-payload";
import { ConnConfUtil } from "../conn-conf/conn-conf-util";
import { PlaylistSaved } from "../messages/incoming/playlist-saved";
import { MpdCommands } from "../mpd/mpd-commands.enum";

@Injectable()
export class WebSocketService {
  /**
   * Command target
   * */
  readonly REMOTE_QUEUE = "/app/mpd";

  constructor(private rxStompService: RxStompService) {}

  send(cmd: MpdCommands): void {
    const data = JSON.stringify({
      type: cmd,
      payload: null,
    });
    this.rxStompService.publish({ destination: this.REMOTE_QUEUE, body: data });
  }

  sendData(cmd: MpdCommands, payload: Record<string, unknown>): void {
    const data = JSON.stringify({
      type: cmd,
      payload,
    });
    this.rxStompService.publish({ destination: this.REMOTE_QUEUE, body: data });
  }

  getStateSubscription(): Observable<StateMsgPayload> {
    return this.rxStompService.watch("/topic/state").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.STATE),
      map((body: BaseResponse) => <StateMsgPayload>body.payload)
    );
  }

  getQueueSubscription(): Observable<QueuePayload> {
    return this.rxStompService.watch("/topic/queue").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.QUEUE),
      map((body: BaseResponse) => <QueuePayload>body.payload)
    );
  }

  getBrowseSubscription(): Observable<BrowseMsgPayload> {
    return this.rxStompService.watch("/topic/controller").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.BROWSE),
      map((body: BaseResponse) => <BrowseMsgPayload>body.payload)
    );
  }

  getSearchSubscription(): Observable<SearchMsgPayload> {
    return this.rxStompService.watch("/topic/controller").pipe(
      map((message) => message.body),
      map((body: string) => <SearchRoot>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.SEARCH_RESULTS),
      map((body: BaseResponse) => <SearchMsgPayload>body.payload)
    );
  }

  getPlaylistSavedSubscription(): Observable<PlaylistSaved> {
    return this.rxStompService.watch("/topic/controller").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.PLAYLIST_SAVED),
      map((body: BaseResponse) => <PlaylistSaved>body.payload)
    );
  }

  init(): void {
    this.rxStompService.configure(ConnConfUtil.loadStompConfig());
    this.rxStompService.activate();
  }
}
