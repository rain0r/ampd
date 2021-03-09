import { Component, OnInit } from "@angular/core";
import { WebSocketService } from "../shared/services/web-socket.service";
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
    private webSocketService: WebSocketService,
    private titleService: Title,
    private mpdService: MpdService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.buildTitle();
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
