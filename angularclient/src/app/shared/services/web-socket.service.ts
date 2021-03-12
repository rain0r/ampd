import { Injectable } from "@angular/core";

import { RxStompService } from "@stomp/ng2-stompjs";
import { BaseResponse } from "../messages/incoming/base-response";
import { MpdTypes } from "../mpd/mpd-types";
import { Observable } from "rxjs";
import { StateMsgPayload } from "../messages/incoming/state-msg-payload";
import { SearchMsgPayload } from "../messages/incoming/search";
import { QueuePayload } from "../messages/incoming/queue-payload";
import { PlaylistSaved } from "../messages/incoming/playlist-saved";
import { MpdCommands } from "../mpd/mpd-commands.enum";
import { filter, map } from "rxjs/operators";

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
    return this.filterAmpdMessages(MpdTypes.STATE, "/topic/state").pipe(
      map((body: BaseResponse) => <StateMsgPayload>body.payload)
    );
  }

  getQueueSubscription(): Observable<QueuePayload> {
    return this.filterAmpdMessages(MpdTypes.QUEUE, "/topic/queue").pipe(
      map((body: BaseResponse) => <QueuePayload>body.payload)
    );
  }

  getSearchSubscription(): Observable<SearchMsgPayload> {
    return this.filterAmpdMessages(
      MpdTypes.SEARCH_RESULTS,
      "/topic/controller"
    ).pipe(map((body: BaseResponse) => <SearchMsgPayload>body.payload));
  }

  getPlaylistSavedSubscription(): Observable<PlaylistSaved> {
    return this.filterAmpdMessages(
      MpdTypes.PLAYLIST_SAVED,
      "/topic/controller"
    ).pipe(map((body: BaseResponse) => <PlaylistSaved>body.payload));
  }

  private filterAmpdMessages(
    mpdType: MpdTypes,
    destination: string
  ): Observable<BaseResponse> {
    return this.rxStompService.watch(destination).pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => body !== null),
      filter((body: BaseResponse) => body.type === mpdType)
    );
  }
}
