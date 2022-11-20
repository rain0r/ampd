import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {
  InternMsg,
  InternMsgType,
} from "./../shared/messages/internal/internal-msg";

@Injectable({
  providedIn: "root",
})
export class MsgService {
  message: Observable<InternMsg>;
  private message$ = new Subject<InternMsg>();

  constructor() {
    this.message = this.message$.asObservable();
  }

  /**
   * For simple messages without payload
   * @param {InternMsgType} type
   */
  sendMessageType(type: InternMsgType): void {
    this.message$.next({ type: type } as InternMsg);
  }

  sendMessage(message: InternMsg): void {
    this.message$.next(message);
  }
}
