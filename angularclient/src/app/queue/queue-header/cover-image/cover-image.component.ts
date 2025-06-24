import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  take,
} from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { MpdService } from "src/app/service/mpd.service";
import { AlbumCoverDialogComponent } from "src/app/shared/album-cover-dialog/album-cover-dialog.component";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { QueueTrack } from "src/app/shared/model/queue-track";

@Component({
  selector: "app-cover-image",
  templateUrl: "./cover-image.component.html",
  styleUrls: ["./cover-image.component.scss"],
  standalone: false,
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
    combineLatest([
      this.mpdService.currentState$.pipe(distinctUntilChanged()),
      this.mpdService.currentTrack$.pipe(
        distinctUntilChanged((prev, curr) => prev.file === curr.file),
      ),
    ]).subscribe(([state, track]) => this.updateCover(state, track));
  }

  private updateCover(state: string, track: QueueTrack): void {
    if (state === "stop") {
      this.displayCover$.next(false);
      return;
    }

    this.http.head(track.coverUrl, { observe: "response" }).subscribe({
      next: (data: unknown) => {
        console.log("data", data);
        this.setDisplayCover();
      },
      error: () => {
        this.displayCover$.next(false);
      },
    });
  }

  setDisplayCover(): void {
    combineLatest([
      this.mpdService.currentState$,
      this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
      this.mpdService.isCurrentTrackRadioStream$(),
    ])
      .pipe(take(3))
      .subscribe(([state, displayCovers, isRadioStream]) => {
        const available =
          isRadioStream === false && // We don't look for covers when a radio stream is playing
          state !== "stop" && // Check state, we don't change the cover if the player has stopped
          displayCovers === true; // Check if cover-display is active in the frontend-settings
        this.displayCover$.next(available);
      });
  }
}
