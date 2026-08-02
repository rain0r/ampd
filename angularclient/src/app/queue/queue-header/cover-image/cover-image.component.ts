import { AsyncPipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, DestroyRef, OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatDialog } from "@angular/material/dialog";
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  distinctUntilChanged,
  take,
} from "rxjs";
import { FrontendSettingsService } from "../../../service/frontend-settings.service";
import { MpdService } from "../../../service/mpd.service";
import { AlbumCoverDialogComponent } from "../../../shared/album-cover-dialog/album-cover-dialog.component";
import { SettingKeys } from "../../../shared/model/internal/frontend-settings";
import { QueueTrack } from "../../../shared/model/queue-track";

@Component({
  selector: "app-cover-image",
  templateUrl: "./cover-image.component.html",
  styleUrls: ["./cover-image.component.scss"],
  imports: [AsyncPipe],
})
export class CoverImageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private frontendSettingsService = inject(FrontendSettingsService);
  private http = inject(HttpClient);
  private mpdService = inject(MpdService);

  isDisplayCover: Observable<boolean>;
  queueTrack: Observable<QueueTrack>;

  private displayCover$ = new BehaviorSubject<boolean>(false);

  constructor() {
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
        takeUntilDestroyed(this.destroyRef),
      ),
    ]).subscribe(([state, track]) => this.updateCover(state, track));
  }

  private updateCover(state: string, track: QueueTrack): void {
    if (state === "stop") {
      this.displayCover$.next(false);
      return;
    }

    this.http
      .head(track.coverUrl, { observe: "response" })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.setDisplayCover(),
        error: () => this.displayCover$.next(false),
      });
  }

  setDisplayCover(): void {
    combineLatest([
      this.mpdService.currentState$,
      this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
      this.mpdService.isCurrentTrackRadioStream$(),
    ])
      .pipe(take(3), takeUntilDestroyed(this.destroyRef))
      .subscribe(([state, displayCovers, isRadioStream]) => {
        const available =
          isRadioStream === false && // We don't look for covers when a radio stream is playing
          state !== "stop" && // Check state, we don't change the cover if the player has stopped
          displayCovers === true; // Check if cover-display is active in the frontend-settings
        this.displayCover$.next(available);
      });
  }
}
