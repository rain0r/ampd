import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AmpdMessage } from "../messages/internal/ampd-message";

@Injectable()
export class MessageService {
  private subject = new Subject<AmpdMessage>();

  sendMessage(message: string, data = ""): void {
    this.subject.next(new AmpdMessage(message, data));
  }

  getMessage(): Observable<AmpdMessage> {
    return this.subject.asObservable();
  }
}
