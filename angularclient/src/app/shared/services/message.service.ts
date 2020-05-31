import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class MessageService {
  private subject = new Subject<any>();

  sendMessage(message: string, data = {}) {
    this.subject.next({ text: message, data });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
