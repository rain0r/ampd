import { Injectable } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { REMOTE_QUEUE } from '../mpd/mpd-commands';
import { filter, map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { ServerStatusRootImpl } from '../messages/incoming/state-messages-impl';
import { QueueRootImpl } from '../messages/incoming/queue-impl';
import { BrowseRootImpl } from '../messages/incoming/browse-impl';
import { SearchRootImpl } from '../messages/incoming/search-impl';

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

  sendData(cmd: string, payload: object): void {
    const data = JSON.stringify({
      type: cmd,
      payload,
    });
    this.stompService.publish(REMOTE_QUEUE, data);
  }

  getStateSubs(): Observable<ServerStatusRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body['type'] === MpdTypes.STATE),
      map(jsonObj => {
        const wsObj: ServerStatusRootImpl = <ServerStatusRootImpl>jsonObj;
        return wsObj;
      })
    );
  }

  getQueueSubs(): Observable<QueueRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body['type'] === MpdTypes.QUEUE),
      map(jsonObj => {
        const wsObj: QueueRootImpl = <QueueRootImpl>jsonObj;
        return wsObj;
      })
    );
  }

  getBrowseSubs(): Observable<BrowseRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body['type'] === MpdTypes.BROWSE),
      map(jsonObj => {
        const wsObj: BrowseRootImpl = <BrowseRootImpl>jsonObj;
        return wsObj;
      })
    );
  }

  getSearchSubs(): Observable<SearchRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => JSON.parse(body)),
      filter(body => body['type'] === MpdTypes.SEARCH_RESULTS),
      map(jsonObj => {
        const wsObj: SearchRootImpl = <SearchRootImpl>jsonObj;
        return wsObj;
      })
    );
  }

  getQueueSubs(): Observable<QueueRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => {
        const jsonObj: any = JSON.parse(body); // string to generic object first, TODO replace by object
        const employee: QueueRootImpl = <QueueRootImpl>jsonObj;
        return employee;
      })
    );
  }

  getBrowseSubs(): Observable<BrowseRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => {
        const jsonObj: any = JSON.parse(body); // string to generic object first, TODO replace by object
        const employee: BrowseRootImpl = <BrowseRootImpl>jsonObj;
        return employee;
      })
    );
  }

  getSearchSubs(): Observable<SearchRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => {
        const jsonObj: any = JSON.parse(body); // string to generic object first, TODO replace by object
        const employee: SearchRootImpl = <SearchRootImpl>jsonObj;
        return employee;
      })
    );
  }
}
