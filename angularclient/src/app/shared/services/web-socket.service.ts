import { Injectable } from "@angular/core";
import { Message } from "@stomp/stompjs";
import {filter, map} from "rxjs/internal/operators";
import { REMOTE_QUEUE } from "../mpd/mpd-commands";
import { RxStompService } from "@stomp/ng2-stompjs";
import { BaseResponse } from "../messages/incoming/base-response";
import {MpdTypes} from "../mpd/mpd-types";

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

  getStateSubscription(): void {
    const foo = this.rxStompService
      .watch("/topic/state")
      .pipe(
        map((message: Message) => message.body),
        map((body: string) => <BaseResponse>JSON.parse(body)),
      )
      .subscribe((foo) => console.log(foo));
  }

  // getQueueSubscription(): Observable<QueueRootImpl> {
  //   return this.rxStompService.subscribe("/topic/queue").pipe(
  //       map((message: Message) => message.body),
  //       map((body) => JSON.parse(body)),
  //       filter((body) => body !== null),
  //       filter((body) => body.type === MpdTypes.QUEUE),
  //       map((jsonObj) => {
  //         return jsonObj as QueueRootImpl;
  //       })
  //   );
  // }
  //
  // getBrowseSubscription(): Observable<BrowseRootImpl> {
  //   return this.rxStompService.subscribe("/topic/controller").pipe(
  //       map((message: Message) => message.body),
  //       map((body) => JSON.parse(body)),
  //       filter((body) => body !== null),
  //       filter((body) => body.type === MpdTypes.BROWSE),
  //       map((jsonObj) => {
  //         return jsonObj as BrowseRootImpl;
  //       })
  //   );
  // }
  //
  // getSearchSubscription(): Observable<SearchRootImpl> {
  //   return this.rxStompService.subscribe("/topic/controller").pipe(
  //       map((message: Message) => message.body),
  //       map((body) => JSON.parse(body)),
  //       filter((body) => body !== null),
  //       filter((body) => body.type === MpdTypes.SEARCH_RESULTS),
  //       map((jsonObj) => {
  //         return jsonObj as SearchRootImpl;
  //       })
  //   );
  // }
}
