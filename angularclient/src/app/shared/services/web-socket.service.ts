import { Injectable } from '@angular/core';
import { StompService } from '@stomp/ng2-stompjs';
import { REMOTE_QUEUE } from '../mpd/mpd-commands';
import { map } from 'rxjs/internal/operators';
import { Observable } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { RootObjectImpl } from '../mpd/state-messages-impl';

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

  getStompSubscription(): Observable<RootObjectImpl> {
    return this.stompService.subscribe('/topic/messages').pipe(
      map((message: Message) => message.body),
      map(body => {
        const jsonObj: any = JSON.parse(body); // string to generic object first
        const employee: RootObjectImpl = <RootObjectImpl>jsonObj;
        return employee;
      })
    );
  }
}
