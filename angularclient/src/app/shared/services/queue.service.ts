import { Injectable } from '@angular/core';
import {RxStompService} from "@stomp/ng2-stompjs";

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private rxStompService: RxStompService) {
  }

  getQueue() {
    this.rxStompService.publish({
      destination: "/app/queue"
    });
  }

  removeAll() {
    this.rxStompService.publish({
      destination: "/app/queue/clear"
    });
  }
}
