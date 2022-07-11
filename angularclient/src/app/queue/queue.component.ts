import { Component, HostListener, OnInit } from "@angular/core";
import { MpdService } from "../service/mpd.service";
import { Title } from "@angular/platform-browser";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { QueueService } from "../service/queue.service";
import { FrontendSettingsService } from "../service/frontend-settings.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
})
export class QueueComponent implements OnInit {
  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private mpdService: MpdService,
    private queueService: QueueService,
    private titleService: Title
  ) {}

  @HostListener("document:visibilitychange", ["$event"])
  onKeyUp(): void {
    if (document.visibilityState === "visible") {
      this.buildTitle();
      this.queueService.getQueue();
    }
  }

  ngOnInit(): void {
    this.buildTitle();
    this.queueService.getQueue();
  }

  /**
   * Subscribe to both the state and title queue and set the title accordingly.
   */
  private buildTitle(): void {
    combineLatest([
      this.mpdService.currentState,
      this.mpdService.currentTrack,
      this.frontendSettingsService.setTabTitle,
    ])
      .pipe(
        map((results) => ({
          state: results[0],
          track: results[1],
          tabTitle: results[2],
        }))
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
          this.titleService.setTitle(
            `${result.track.artistName} — ${result.track.title}`
          );
        }
      });
  }
}
