import { Injectable } from "@angular/core";
import { filter, map } from "rxjs/internal/operators";
import { REMOTE_QUEUE } from "../mpd/mpd-commands";
import { RxStompService } from "@stomp/ng2-stompjs";
import { BaseResponse } from "../messages/incoming/base-response";
import { MpdTypes } from "../mpd/mpd-types";
import { Observable } from "rxjs";
import { IStateMsgPayload } from "../messages/incoming/state-msg-payload";
import { IBrowseMsgPayload } from "../messages/incoming/browse";
import { ISearchMsgPayload, ISearchRoot } from "../messages/incoming/search";
import { IQueuePayload } from "../messages/incoming/queue-payload";
import { ConnConfUtil } from "../conn-conf/conn-conf-util";

@Injectable()
export class WebSocketService {
  constructor(private rxStompService: RxStompService) {}

  send(cmd: string): void {
    const data = JSON.stringify({
      type: cmd,
      payload: null,
    });
    this.rxStompService.publish({ destination: REMOTE_QUEUE, body: data });
  }

  sendData(cmd: string, payload: Record<string, unknown>): void {
    const data = JSON.stringify({
      type: cmd,
      payload,
    });
    this.rxStompService.publish({ destination: REMOTE_QUEUE, body: data });
  }

  getStateSubscription(): Observable<IStateMsgPayload> {
    return this.rxStompService.watch("/topic/state").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.STATE),
      map((body: BaseResponse) => <IStateMsgPayload>body.payload)
    );
  }

  getQueueSubscription(): Observable<IQueuePayload> {
    return this.rxStompService.watch("/topic/queue").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.QUEUE),
      map((body: BaseResponse) => <IQueuePayload>body.payload)
    );
  }

  getBrowseSubscription(): Observable<IBrowseMsgPayload> {
    return this.rxStompService.watch("/topic/controller").pipe(
      map((message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.BROWSE),
      map((body: BaseResponse) => <IBrowseMsgPayload>body.payload)
    );
  }

  getSearchSubscription(): Observable<ISearchMsgPayload> {
    return this.rxStompService.watch("/topic/controller").pipe(
      map((message) => message.body),
      map((body: string) => <ISearchRoot>JSON.parse(body)),
      filter((body: BaseResponse) => !!body),
      filter((body: BaseResponse) => body.type === MpdTypes.SEARCH_RESULTS),
      map((body: BaseResponse) => <ISearchMsgPayload>body.payload)
    );
  }

  init(): void {
    this.rxStompService.configure(ConnConfUtil.loadStompConfig());
    this.rxStompService.activate();
  }
}
