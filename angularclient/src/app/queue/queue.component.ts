import { Component, HostListener, OnInit } from "@angular/core";
import { MpdService } from "../shared/services/mpd.service";
import { Title } from "@angular/platform-browser";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { SettingsService } from "../shared/services/settings.service";

@Component({
  selector: "app-queue",
  templateUrl: "./queue.component.html",
  styleUrls: ["./queue.component.scss"],
})
export class QueueComponent implements OnInit {
  constructor(
    private mpdService: MpdService,
    private settingsService: SettingsService,
    private titleService: Title
  ) {}

  @HostListener("document:visibilitychange", ["$event"])
  onKeyUp(): void {
    if (document.visibilityState === "visible") {
      this.buildTitle();
      this.mpdService.refreshQueue();
    }
  }

  ngOnInit(): void {
    this.buildTitle();
    this.mpdService.refreshQueue();
  }

  /**
   * Subscribe to both the state and title queue and set the title accordingly.
   */
  private buildTitle(): void {
    combineLatest([
      this.mpdService.currentState,
      this.mpdService.currentTrack,
      this.settingsService.isSetTabTitle,
    ])
      .pipe(
        map((results) => ({
          state: results[0],
          track: results[1],
          tabTitle: results[2],
        }))
      )
      .subscribe((result) => {
        if (!result.tabTitle) {
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
