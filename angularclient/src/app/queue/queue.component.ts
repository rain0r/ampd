import { Component, HostListener, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { FrontendSettingsService } from "../service/frontend-settings.service";
import { MpdService } from "../service/mpd.service";
import { SettingKeys } from "../shared/model/internal/frontend-settings";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
  standalone: false,
})
export class QueueComponent implements OnInit {
  connected$: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private mpdService: MpdService,
    private titleService: Title,
  ) {
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
