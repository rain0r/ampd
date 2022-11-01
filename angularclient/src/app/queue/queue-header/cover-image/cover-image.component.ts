import { HttpClient } from "@angular/common/http";
import { AfterViewChecked, Component, Input } from "@angular/core";
import { InitDetail } from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  tap,
} from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { LIGHTBOX_SETTINGS } from "src/app/shared/lightbox";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { QueueTrack } from "src/app/shared/model/queue-track";

interface CoverData {
  coverAvailable: boolean;
  isDisplayCover: boolean;
  coverSizeClass: string;
  track: QueueTrack;
}

@Component({
  selector: "app-cover-image",
  templateUrl: "./cover-image.component.html",
  styleUrls: ["./cover-image.component.scss"],
})
export class CoverImageComponent implements AfterViewChecked {
  @Input() set track(track: QueueTrack) {
    this.track$.next(track);
  }
  @Input() set state(state: string) {
    this.state$.next(state);
  }

  lightboxSettings = LIGHTBOX_SETTINGS;
  coverData: Observable<CoverData> = new Observable<CoverData>();

  private firstTrack = true;
  private lightGallery!: LightGallery;
  private state$ = new BehaviorSubject<string>("stop");
  private track$ = new Subject<QueueTrack>();

  constructor(
    private responsiveCoverSizeService: ResponsiveScreenService,
    private frontendSettingsService: FrontendSettingsService,
    private http: HttpClient
  ) {
    combineLatest([
      this.isDisplayCover(),
      this.responsiveCoverSizeService.getCoverCssClass(),
      this.track$.asObservable(),
    ])
      .pipe(
        map(([displayCover, cssClass, track]) => {
          return {
            isDisplayCover: displayCover,
            coverSizeClass: cssClass,
            track: track,
            coverAvailable: false,
          } as CoverData;
        }),
        distinctUntilChanged((prev, curr) => {
          // Ignore elapsed time because that won't trigger a cover update
          prev.track.elapsed = 0;
          curr.track.elapsed = 0;
          return JSON.stringify(curr) === JSON.stringify(prev);
        }),
        tap((cv) => console.log("tap()", cv))
      )
      .subscribe((cv) => {
        // It seems like combineLatest is not triggered when in paused mode
        // Leads to an non-displayed cover
        // This is a hack to circumvent that
        if (cv.isDisplayCover === true) {
          if (this.firstTrack === true) {
            this.firstTrack = false;
          }
          this.isCoverAvailable(cv).subscribe(
            (head) => (this.coverData = of(head))
          );
        } else {
          this.coverData = of(cv);
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.lightGallery) {
      this.lightGallery.refresh();
    }
  }

  onInit = (detail: InitDetail): void => {
    this.lightGallery = detail.instance;
  };

  private isCoverAvailable(coverData: CoverData): Observable<CoverData> {
    return this.http
      .head(coverData.track.coverUrl, { observe: "response" })
      .pipe(
        map((response) => {
          coverData.coverAvailable = response.status === 200;
          return coverData;
        })
      );
  }

  private isDisplayCover() {
    return combineLatest([
      this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
      this.state$.pipe(map((state) => state !== "stop")),
    ]).pipe(
      map((result) => {
        return result[0] === true && result[1] === true;
      })
    );
  }
}
