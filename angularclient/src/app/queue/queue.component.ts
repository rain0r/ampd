import { AsyncPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDivider } from "@angular/material/divider";
import { Title } from "@angular/platform-browser";
import { Observable, combineLatest } from "rxjs";
import { FrontendSettingsService } from "../service/frontend-settings.service";
import { MpdService } from "../service/mpd.service";
import { SettingKeys } from "../shared/model/internal/frontend-settings";
import { QueueTrack } from "../shared/model/queue-track";
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import { MpdModeComponent } from "./mpd-modes/mpd-mode.component";
import { QueueHeaderComponent } from "./queue-header/queue-header.component";
import { TrackProgressComponent } from "./track-progress/track-progress.component";
import { TrackTableComponent } from "./track-table/track-table.component";
import { VolumeSliderComponent } from "./volume-slider/volume-slider.component";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    QueueHeaderComponent,
    MatDivider,
    ControlPanelComponent,
    MpdModeComponent,
    TrackProgressComponent,
    VolumeSliderComponent,
    TrackTableComponent,
    AsyncPipe,
  ],
})
export class QueueComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private frontendSettingsService = inject(FrontendSettingsService);
  private mpdService = inject(MpdService);
  private titleService = inject(Title);

  readonly connected$: Observable<boolean>;

  constructor() {
    this.connected$ = this.mpdService.isConnected$();
  }

  ngOnInit(): void {
    this.buildTitle();
  }

  /**
   * Combine the playback state, the current track, and the UPDATE_TAB_TITLE setting
   */
  private buildTitle(): void {
    combineLatest([
      this.mpdService.currentState$,
      this.mpdService.currentTrack$,
      this.frontendSettingsService.getBoolValue$(SettingKeys.UPDATE_TAB_TITLE),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([state, track, updateTitle]) => {
        if (!updateTitle) {
          return;
        }
        const title = this.resolveTitle(state, track);
        if (title) {
          this.titleService.setTitle(title);
        }
      });
  }

  /**
   * Build the tab title for the currently played track. Returns an empty string when nothing meaningful can be shown (e.g. an untagged file or radio stream).
   */
  private resolveTitle(
    state: "stop" | "play" | "pause",
    track: QueueTrack,
  ): string {
    if (state === "stop") {
      return "Stopped";
    }
    if (track.artistName && track.title) {
      return `${track.artistName} — ${track.title}`;
    }
    return track.title || track.artistName;
  }
}
