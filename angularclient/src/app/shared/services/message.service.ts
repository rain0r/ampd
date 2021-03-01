import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { InternalMessageType } from "../messages/internal/internal-message-type.enum";
import { InternalMessage } from "../messages/internal/internal-message";

@Injectable()
export class MessageService {
  message: Observable<InternalMessage>;
  private subject = new Subject<InternalMessage>();

  constructor() {
    this.message = this.subject.asObservable();
  }

  /**
   * For simple messages without payload
   * @param {InternalMessageType} type
   */
  sendMessageType(type: InternalMessageType): void {
    this.subject.next({ type: type } as InternalMessage);
  }

  sendMessage(message: InternalMessage): void {
    this.subject.next(message);
  }
}
