import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AmpdMessage } from "../messages/internal/ampd-message";
import { InternalMessageType } from "../messages/internal/internal-message-type.enum";

@Injectable()
export class MessageService {
  private subject = new Subject<AmpdMessage>();

  sendMessage(message: InternalMessageType, data = ""): void {
    this.subject.next(new AmpdMessage(message, data));
  }

  getMessage(): Observable<AmpdMessage> {
    return this.subject.asObservable();
  }
}
