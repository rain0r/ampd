import { Injectable } from "@angular/core";
import { RxStompService } from "@stomp/ng2-stompjs";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  withLatestFrom,
} from "rxjs/operators";
import { StateMsgPayload } from "../messages/incoming/state-msg-payload";
import { VolumeSetter } from "../models/volume-setter";

@Injectable({
  providedIn: "root",
})
export class VolumeService {
  volume: Observable<number>;
  volumeSetter: Observable<VolumeSetter>;
  private path = "/app/control-panel/";
  private volume$ = new BehaviorSubject<number>(0);
  private volumeSetter$ = new Subject<VolumeSetter>();

  constructor(private rxStompService: RxStompService) {
    this.volume = this.volume$.asObservable();
    this.volumeSetter = this.volumeSetter$.asObservable();
    this.buildStateSubscription();
    this.buildVolumeSetter();
  }

  decreaseVolume(): void {
    this.volumeSetter$.next({
      increase: false,
      step: 1,
    } as VolumeSetter);
  }

  increaseVolume(): void {
    this.volumeSetter$.next({
      increase: true,
      step: 1,
    } as VolumeSetter);
  }

  setVolume(volume: number | null): void {
    this.rxStompService.publish({
      destination: `${this.path}volume`,
      body: JSON.stringify(volume),
    });
  }

  /**
   * Listen 500ms and sums up the keystrokes. Add the sum to the current volume.
   */
  private buildVolumeSetter(): void {
    const volInput = this.volumeSetter$.asObservable().pipe(
      bufferTime(500),
      filter((times) => times.length > 0)
    );
    volInput.pipe(withLatestFrom(this.volume)).subscribe(([times, volume]) => {
      const newVol = times[0].increase
        ? volume + times.length
        : volume - times.length;
      this.setVolume(newVol);
    });
  }

  private getStateSubscription(): Observable<StateMsgPayload> {
    return this.rxStompService.watch("/topic/state").pipe(
      map((message) => message.body),
      map((body: string) => <StateMsgPayload>JSON.parse(body)),
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );
  }

  private buildStateSubscription(): void {
    this.getStateSubscription().subscribe((payload) =>
      this.volume$.next(payload.serverStatus.volume)
    );
  }
}
