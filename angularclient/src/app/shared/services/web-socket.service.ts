import { Injectable } from "@angular/core";
import { StompService } from "@stomp/ng2-stompjs";
import { Message } from "@stomp/stompjs";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/internal/operators";
import { BrowseRootImpl } from "../messages/incoming/browse";
import { QueueRootImpl } from "../messages/incoming/queue";
import { SearchRootImpl } from "../messages/incoming/search";
import { ServerStatusRootImpl } from "../messages/incoming/state-messages";
import { REMOTE_QUEUE } from "../mpd/mpd-commands";
import { MpdTypes } from "../mpd/mpd-types";

@Injectable()
export class WebSocketService {
  constructor(private stompService: StompService) {}

  send(cmd: string): void {
    const data = JSON.stringify({
      type: cmd,
      payload: null,
    });
    this.stompService.publish(REMOTE_QUEUE, data);
  }

  sendData(cmd: string, payload: Record<string, unknown>): void {
    const data = JSON.stringify({
      type: cmd,
      payload,
    });
    this.stompService.publish(REMOTE_QUEUE, data);
  }

  getStateSubscription(): Observable<ServerStatusRootImpl> {
    return this.stompService.subscribe("/topic/state").pipe(
      map((message: Message) => message.body),
      map((body) => JSON.parse(body)),
      filter((body) => body !== null),
      filter((body) => body.type === MpdTypes.STATE),
      map((jsonObj) => {
        return jsonObj as ServerStatusRootImpl;
      })
    );
  }

  getQueueSubscription(): Observable<QueueRootImpl> {
    return this.stompService.subscribe("/topic/queue").pipe(
      map((message: Message) => message.body),
      map((body) => JSON.parse(body)),
      filter((body) => body !== null),
      filter((body) => body.type === MpdTypes.QUEUE),
      map((jsonObj) => {
        return jsonObj as QueueRootImpl;
      })
    );
  }

  getBrowseSubscription(): Observable<BrowseRootImpl> {
    return this.stompService.subscribe("/topic/controller").pipe(
      map((message: Message) => message.body),
      map((body) => JSON.parse(body)),
      filter((body) => body !== null),
      filter((body) => body.type === MpdTypes.BROWSE),
      map((jsonObj) => {
        return jsonObj as BrowseRootImpl;
      })
    );
  }

  getSearchSubscription(): Observable<SearchRootImpl> {
    return this.stompService.subscribe("/topic/controller").pipe(
      map((message: Message) => message.body),
      map((body) => JSON.parse(body)),
      filter((body) => body !== null),
      filter((body) => body.type === MpdTypes.SEARCH_RESULTS),
      map((jsonObj) => {
        return jsonObj as SearchRootImpl;
      })
    );
  }
}
