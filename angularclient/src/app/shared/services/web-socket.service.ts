import { Injectable } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { REMOTE_QUEUE } from '../mpd/mpd-commands';
import { map } from 'rxjs/internal/operators';
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

  // /**
  //  * @deprecated
  //  * @returns {Observable<ServerStatusRootImpl>}
  //  */
  // getStompSubscription(): Observable<ServerStatusRootImpl> {
  //   return this.stompService.subscribe('/topic/messages').pipe(
  //     map((message: Message) => message.body),
  //     map(body => {
  //       const jsonObj: any = JSON.parse(body); // string to generic object first
  //       const employee: ServerStatusRootImpl = <ServerStatusRootImpl>jsonObj;
  //       return employee;
  //     })
  //   );
  // }

  getStateSubs(): Observable<ServerStatusRootImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => {
        const jsonObj: any = JSON.parse(body); // string to generic object first, TODO replace by object
        const employee: ServerStatusRootImpl = <ServerStatusRootImpl>jsonObj;
        return employee;
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
