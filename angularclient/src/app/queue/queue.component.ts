import { Component, HostListener, OnInit, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { FrontendSettingsService } from "../service/frontend-settings.service";
import { MpdService } from "../service/mpd.service";
import { SettingKeys } from "../shared/model/internal/frontend-settings";
import { QueueHeaderComponent } from "./queue-header/queue-header.component";
import { MatDivider } from "@angular/material/divider";
import { ControlPanelComponent } from "./control-panel/control-panel.component";
import { MpdModeComponent } from "./mpd-modes/mpd-mode.component";
import { TrackProgressComponent } from "./track-progress/track-progress.component";
import { VolumeSliderComponent } from "./volume-slider/volume-slider.component";
import { TrackTableComponent } from "./track-table/track-table.component";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
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
  private frontendSettingsService = inject(FrontendSettingsService);
  private mpdService = inject(MpdService);
  private titleService = inject(Title);

  connected$: Observable<boolean>;

  constructor() {
    this.connected$ = this.mpdService.isConnected$();
  }

  @HostListener("document:visibilitychange", ["$event"])
  onKeyUp(): void {
    if (document.visibilityState === "visible") {
      this.buildTitle();
    }
  }

  ngOnInit(): void {
    this.buildTitle();
  }

  /**
   * Subscribe to both the state and title queue and set the title accordingly.
   */
  private buildTitle(): void {
    combineLatest([
      this.mpdService.currentState$,
      this.mpdService.currentTrack$,
      this.frontendSettingsService.getBoolValue$(SettingKeys.UPDATE_TAB_TITLE),
    ])
      .pipe(
        map((results) => ({
          state: results[0],
          track: results[1],
          tabTitle: results[2],
        })),
      )
      .subscribe((result) => {
        if (
          !result.tabTitle ||
          /* Empty artist and title (maybe web radio stream?) */
          (result.track.artistName === "" && result.track.title === "")
        ) {
          return;
        }
        if (result.state === "stop") {
          this.titleService.setTitle("Stopped");
        } else {
          if (result.track.artistName && result.track.title) {
            this.titleService.setTitle(
              `${result.track.artistName} — ${result.track.title}`,
            );
          }
        }
      });
  }
}
