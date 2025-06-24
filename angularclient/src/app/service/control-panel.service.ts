import { Injectable, inject } from "@angular/core";
import {
  Subject,
  debounceTime,
  first,
  map,
  pairwise,
  scan,
  startWith,
  take,
} from "rxjs";
import { MpdModesPanel } from "../shared/messages/incoming/mpd-modes-panel";
import { SettingKeys } from "../shared/model/internal/frontend-settings";
import { AmpdRxStompService } from "./ampd-rx-stomp.service";
import { FrontendSettingsService } from "./frontend-settings.service";
import { MpdService } from "./mpd.service";

interface JumpSeekCounter {
  backwards: boolean;
  counter?: number;
}

@Injectable({
  providedIn: "root",
})
export class ControlPanelService {
  private fsSettings = inject(FrontendSettingsService);
  private mpdService = inject(MpdService);
  private rxStompService = inject(AmpdRxStompService);

  private path = "/app/control-panel/";
  private seekJump$ = new Subject<JumpSeekCounter>();

  constructor() {
    this.buildSeekJumpListener();
  }

  prev(): void {
    this.rxStompService.publish({
      destination: `${this.path}prev`,
    });
  }

  stop(): void {
    this.rxStompService.publish({
      destination: `${this.path}stop`,
    });
  }

  pause(): void {
    this.rxStompService.publish({
      destination: `${this.path}pause`,
    });
  }

  play(): void {
    this.rxStompService.publish({
      destination: `${this.path}play`,
    });
  }

  next(): void {
    this.rxStompService.publish({
      destination: `${this.path}next`,
    });
  }

  seek(position: number | null): void {
    if (position) {
      this.rxStompService.publish({
        destination: `${this.path}seek`,
        body: JSON.stringify(position),
      });
    }
  }

  toggleMpdModes(mpdModesPanel: MpdModesPanel): void {
    this.rxStompService.publish({
      destination: `${this.path}mpd-modes-panel`,
      body: JSON.stringify(mpdModesPanel),
    });
  }

  seekJump(backwards: boolean): void {
    this.mpdService.currentTrack$
      .pipe(
        map((track) => track.elapsed),
        first(),
      )
      .subscribe((elapsed) => {
        let to = 0;
        if (backwards) {
          to =
            elapsed - this.fsSettings.getIntValue(SettingKeys.JUMP_SEEK) || 0;
        } else {
          to =
            elapsed + this.fsSettings.getIntValue(SettingKeys.JUMP_SEEK) || 0;
        }
        this.seek(to);
      });
  }

  seekJumpBtnListener(backwards: boolean): void {
    this.seekJump$.next({
      backwards: backwards,
    });
  }

  private buildSeekJumpListener(): void {
    const elapsed = this.mpdService.currentTrack$.pipe(
      take(1),
      map((track) => track.elapsed),
    );

    const seek = this.seekJump$.asObservable().pipe(
      scan((acc, curr) => {
        const tmp = Object.assign({}, acc, curr);
        if (!tmp.counter) {
          tmp.counter = 0;
        }
        tmp.counter += 1;
        return tmp;
      }, {} as JumpSeekCounter),
      debounceTime(750),
      startWith({} as JumpSeekCounter),
      pairwise(),
      map(([previous, current]) => {
        const tmp = Object.assign({}, previous, current);
        tmp.counter = (current.counter || 0) - (previous.counter || 0);
        return tmp;
      }),
    );
    seek.subscribe((seekData) => {
      elapsed.subscribe((elapsedData) => {
        const seekAmount =
          (seekData.counter || 1) *
          this.fsSettings.getIntValue(SettingKeys.JUMP_SEEK);

        let to = 0;
        if (seekData.backwards) {
          to = elapsedData - seekAmount || 0;
        } else {
          to = elapsedData + seekAmount || 0;
        }

        this.seek(to);
      });
    });
  }
}
