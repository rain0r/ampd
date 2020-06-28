import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { InternalMessageType } from "../messages/internal/internal-message-type.enum";
import { InternalMessage } from "../messages/internal/internal-message";

@Injectable()
export class MessageService {
  private subject = new Subject<InternalMessage>();

  /**
   * For simple messages without payload
   * @param {InternalMessageType} type
   */
  sendMessageType(type: InternalMessageType): void {
    console.log(`Sending message type: ${type}`);
    this.subject.next({ type: type } as InternalMessage);
  }

  sendMessage(message: InternalMessage): void {
    console.log(`Sending message`, message);
    this.subject.next(message);
  }

  getMessage(): Observable<InternalMessage> {
    return this.subject.asObservable();
  }
}
