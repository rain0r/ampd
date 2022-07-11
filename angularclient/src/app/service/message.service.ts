import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { InternalMessageType } from "../shared/messages/internal/internal-message-type.enum";
import { InternalMessage } from "../shared/messages/internal/internal-message";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  message: Observable<InternalMessage>;
  private message$ = new Subject<InternalMessage>();

  constructor() {
    this.message = this.message$.asObservable();
  }

  /**
   * For simple messages without payload
   * @param {InternalMessageType} type
   */
  sendMessageType(type: InternalMessageType): void {
    this.message$.next({ type: type } as InternalMessage);
  }

  sendMessage(message: InternalMessage): void {
    this.message$.next(message);
  }
}
