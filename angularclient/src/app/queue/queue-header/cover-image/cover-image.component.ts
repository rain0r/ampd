import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, combineLatest, filter } from "rxjs";
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
    let first = true;

    combineLatest([
      this.mpdService.currentTrack$,
      this.mpdService.currentState$.pipe(filter((state) => state !== "stop")),
    ]).subscribe(([track]) => {
      if (first || track.changed) {
        first = false;
        this.updateCover(track);
      }
    });
  }

  private updateCover(track: QueueTrack): void {
    this.http.head(track.coverUrl, { observe: "response" }).subscribe({
      error: () => this.displayCover$.next(false),
      next: () => this.coverAvailable(),
    });
  }

  coverAvailable(): void {
    combineLatest([
      this.mpdService.currentState$,
      this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
      this.mpdService.isCurrentTrackRadioStream$(),
    ]).subscribe(([state, displayCovers, isRadioStream]) => {
      this.displayCover$.next(
        isRadioStream === false && // We don't look for covers when a radio stream is playing
          state !== "stop" && // Check state, we don't change the cover if the player has stopped
          displayCovers === true, // Check if cover-display is active in the frontend-settings
      );
    });
  }
}
