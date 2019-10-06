import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs/index";
import {QueueTrack} from "../models/queue-track";

@Injectable()
export class QueueService {
  private resultList: Subject<QueueTrack[]> = new Subject<QueueTrack[]>();
  public resultList$: Observable<QueueTrack[]> = this.resultList.asObservable();

  /* For subscribing */
  updateResultList(updatedList) {
    this.resultList.next(updatedList);
  }

  clear() {
    this.resultList = new BehaviorSubject<QueueTrack[]>();
  }
}
