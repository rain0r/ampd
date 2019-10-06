import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs/index";
import {QueueTrack} from "../models/queue-track";

@Injectable()
export class QueueService {
    private resultList: BehaviorSubject<QueueTrack[]> = new BehaviorSubject<QueueTrack[]>([]);
    public resultList$: Observable<QueueTrack[]> = this.resultList.asObservable();

    /* For subscribing */
    addTrack(updatedList) {
        // this.resultList.next(updatedList);
        const currentValue = this.resultList.value;
        const updatedValue = [...currentValue, updatedList];
        this.resultList.next(updatedValue);
    }

    clear() {
        this.resultList = new BehaviorSubject<QueueTrack[]>([]);
    }
}
