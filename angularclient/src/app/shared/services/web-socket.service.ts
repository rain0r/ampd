import { Injectable } from "@angular/core";
import { Message } from "@stomp/stompjs";
import { filter, map } from "rxjs/internal/operators";
import { REMOTE_QUEUE } from "../mpd/mpd-commands";
import { RxStompService } from "@stomp/ng2-stompjs";
import { BaseResponse } from "../messages/incoming/base-response";
import { MpdTypes } from "../mpd/mpd-types";
import { Observable } from "rxjs";
import { IStateMsgPayload } from "../messages/incoming/state-msg-payload";
import { IBrowseRoot } from "../messages/incoming/browse";
import { ISearchRoot } from "../messages/incoming/search";
import { IQueuePayload } from "../messages/incoming/queue-payload";

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
      map((message: Message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => body.type === MpdTypes.STATE),
      map((body: BaseResponse) => <IStateMsgPayload>body.payload)
    );
  }

  getQueueSubscription(): Observable<IQueuePayload> {
    return this.rxStompService.watch("/topic/queue").pipe(
      map((message: Message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => body.type === MpdTypes.QUEUE),
      map((body: BaseResponse) => <IQueuePayload>body.payload)
    );
  }

  getBrowseSubscription(): Observable<IBrowseRoot> {
    return this.rxStompService.watch("/topic/controller").pipe(
      map((message: Message) => message.body),
      map((body: string) => <BaseResponse>JSON.parse(body)),
      filter((body: BaseResponse) => body.type === MpdTypes.BROWSE),
      map((body: BaseResponse) => <IBrowseRoot>body.payload)
    );
  }

  getSearchSubscription(): Observable<ISearchRoot> {
    return this.rxStompService.watch("/topic/controller").pipe(
      map((message: Message) => message.body),
      map((body: string) => <ISearchRoot>JSON.parse(body)),
      filter((body: BaseResponse) => body.type === MpdTypes.SEARCH_RESULTS),
      map((body: BaseResponse) => <ISearchRoot>body.payload)
    );
  }

  init(): void {
    this.rxStompService.activate();
  }
}
