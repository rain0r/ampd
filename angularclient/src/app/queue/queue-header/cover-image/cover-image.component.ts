import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, combineLatest, filter, take } from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { MpdService } from "src/app/service/mpd.service";
import { AlbumCoverDialogComponent } from "src/app/shared/album-cover-dialog/album-cover-dialog.component";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { QueueTrack } from "src/app/shared/model/queue-track";

@Component({
  selector: "app-cover-image",
  templateUrl: "./cover-image.component.html",
  styleUrls: ["./cover-image.component.scss"],
})
export class CoverImageComponent implements OnInit {
  isDisplayCover: Observable<boolean>;
  queueTrack: Observable<QueueTrack>;

  private displayCover$ = new BehaviorSubject<boolean>(false);

  constructor(
    private dialog: MatDialog,
    private frontendSettingsService: FrontendSettingsService,
    private http: HttpClient,
    private mpdService: MpdService,
  ) {
    this.isDisplayCover = this.displayCover$.asObservable();
    this.queueTrack = this.mpdService.currentTrack$;
  }

  ngOnInit(): void {
    this.buildCover();
  }

  openCoverDialog(coverUrl: string): void {
    this.dialog.open(AlbumCoverDialogComponent, {
      data: coverUrl,
    });
  }

  private buildCover(): void {
    console.log("buildCover()");
    this.mpdService.currentTrack$.subscribe((track) => {
      console.log("Subscribed buildCover()");
      this.updateCover(track);
    });
  }

  private updateCover(track: QueueTrack): void {
    console.log("updateCover()", track);
    this.mpdService.currentState$
      .pipe(
        take(1),
        filter((state) => state !== "stop"),
      )
      .subscribe(() => {
        this.http.head(track.coverUrl, { observe: "response" }).subscribe({
          error: () => {
            this.displayCover$.next(false);
          },
          next: () => this.coverAvailable(),
        });
      });
  }

  coverAvailable(): void {
    console.log("coverAvailable()");
    combineLatest([
      this.mpdService.currentState$,
      this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
      this.mpdService.isCurrentTrackRadioStream$(),
    ])
      .pipe(take(1))
      .subscribe(([state, displayCovers, isRadioStream]) => {
        console.log("isRadioStream", isRadioStream);
        console.log("state", state);
        console.log("displayCovers", displayCovers);
        this.displayCover$.next(
          isRadioStream === false && // We don't look for covers when a radio stream is playing
            state !== "stop" && // Check state, we don't change the cover if the player has stopped
            displayCovers === true, // Check if cover-display is active in the frontend-settings
        );
      });
  }
}
