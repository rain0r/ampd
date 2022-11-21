import { HttpClient } from "@angular/common/http";
import { AfterViewChecked, Component, Input, OnInit } from "@angular/core";
import { InitDetail } from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { LIGHTBOX_SETTINGS } from "src/app/shared/lightbox";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { QueueTrack } from "src/app/shared/model/queue-track";

@Component({
  selector: "app-cover-image",
  templateUrl: "./cover-image.component.html",
  styleUrls: ["./cover-image.component.scss"],
})
export class CoverImageComponent implements OnInit, AfterViewChecked {
  @Input() set track(track: QueueTrack) {
    this.track$.next(track);
  }
  @Input() set state(state: string) {
    this.state$.next(state);
  }

  lightboxSettings = LIGHTBOX_SETTINGS;
  isDisplayCover: Observable<boolean>;
  coverSizeClass: Observable<string>;
  currTrack: Observable<QueueTrack>;

  private lightGallery!: LightGallery;
  private state$ = new BehaviorSubject<string>("stop");
  private track$ = new Subject<QueueTrack>();
  private displayCover$ = new BehaviorSubject<boolean>(false);

  constructor(
    private responsiveCoverSizeService: ResponsiveScreenService,
    private frontendSettingsService: FrontendSettingsService,
    private http: HttpClient
  ) {
    this.isDisplayCover = this.displayCover$.asObservable();
    this.coverSizeClass = this.responsiveCoverSizeService.getCoverCssClass();
    this.currTrack = this.track$.asObservable();
  }

  ngAfterViewChecked(): void {
    if (this.lightGallery) {
      this.lightGallery.refresh();
    }
  }

  onInit = (detail: InitDetail): void => {
    this.lightGallery = detail.instance;
  };

  ngOnInit(): void {
    this.buildCover();
  }

  private buildCover(): void {
    let first = true;
    this.track$.asObservable().subscribe((track) => {
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
      this.state$.asObservable(),
      this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
      this.currTrack,
    ]).subscribe(([state, displayCovers, currTrack]) => {
      this.displayCover$.next(
        state !== "stop" && // Check state, we don't change the cover if the player has stopped
          displayCovers === true && // Check if cover-display is active in the frontend-settings
          typeof currTrack.albumName === "string" // No need to check for a cover, if there is no album name
      );
    });
  }
}
