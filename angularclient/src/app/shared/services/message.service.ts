import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class MessageService {
  private subject = new Subject<any>();

  public sendMessage(message: string, data = {}) {
    this.subject.next({ text: message, data });
  }

  public clearMessage() {
    this.subject.next();
  }

  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
