import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { bufferTime, filter, withLatestFrom } from "rxjs/operators";
import { VolumeSetter } from "../shared/model/volume-setter";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";
import { MpdService } from "./mpd.service";

@Injectable({
  providedIn: "root",
})
export class VolumeService {
  private rxStompService = inject(AmpdRxStompService);
  private mpdService = inject(MpdService);

  volume: Observable<number>;
  volumeSetter: Observable<VolumeSetter>;
  private path = "/app/control-panel/";
  private volume$ = new BehaviorSubject<number>(0);
  private volumeSetter$ = new Subject<VolumeSetter>();

  constructor() {
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
      filter((times) => times.length > 0),
    );
    volInput.pipe(withLatestFrom(this.volume)).subscribe(([times, volume]) => {
      const newVol = times[0].increase
        ? volume + times.length
        : volume - times.length;
      this.setVolume(newVol);
    });
  }

  private buildStateSubscription(): void {
    this.mpdService.state$.subscribe((payload) =>
      this.volume$.next(payload.serverStatus.volume),
    );
  }
}
