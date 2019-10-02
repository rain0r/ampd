import { Injectable } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/internal/operators';
import { BrowseRootImpl } from '../messages/incoming/browse-impl';
import { QueueRootImpl } from '../messages/incoming/queue-impl';
import { SearchRootImpl } from '../messages/incoming/search-impl';
import { ServerStatusRootImpl } from '../messages/incoming/state-messages-impl';
import { REMOTE_QUEUE } from '../mpd/mpd-commands';
import { MpdTypes } from '../mpd/mpd-types';

@Injectable()
export class WebSocketService {
  constructor(private stompService: StompService) {}

  public send(cmd: string): void {
    const data = JSON.stringify({
      type: cmd,
      payload: null,
    });
    this.stompService.publish(REMOTE_QUEUE, data);
  }

  public sendData(cmd: string, payload: object): void {
    const data = JSON.stringify({
      type: cmd,
      payload,
    });
    this.stompService.publish(REMOTE_QUEUE, data);
  }

  public getStateSubs(): Observable<ServerStatusRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body.type === MpdTypes.STATE),
      map(jsonObj => {
        const wsObj: ServerStatusRootImpl = jsonObj as ServerStatusRootImpl;
        return wsObj;
      })
    );
  }

  public getQueueSubs(): Observable<QueueRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body.type === MpdTypes.QUEUE),
      map(jsonObj => {
        const wsObj: QueueRootImpl = jsonObj as QueueRootImpl;
        return wsObj;
      })
    );
  }

  public getBrowseSubs(): Observable<BrowseRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body.type === MpdTypes.BROWSE),
      map(jsonObj => {
        const wsObj: BrowseRootImpl = jsonObj as BrowseRootImpl;
        return wsObj;
      })
    );
  }

  public getSearchSubs(): Observable<SearchRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body.type === MpdTypes.SEARCH_RESULTS),
      map(jsonObj => {
        const wsObj: SearchRootImpl = jsonObj as SearchRootImpl;
        return wsObj;
      })
    );
  }
}
