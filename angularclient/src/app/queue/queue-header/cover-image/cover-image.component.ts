import { HttpClient } from "@angular/common/http";
import { AfterViewChecked, Component, Input } from "@angular/core";
import { InitDetail } from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  map,
  Observable,
  Subject,
} from "rxjs";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { LIGHTBOX_SETTINGS } from "src/app/shared/lightbox";
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
  coverData: Observable<CoverData>;

  private lightGallery!: LightGallery;
  private state$ = new BehaviorSubject<string>("stop");
  private track$ = new Subject<QueueTrack>();

  constructor(
    private responsiveCoverSizeService: ResponsiveScreenService,
    private frontendSettingsService: FrontendSettingsService,
    private http: HttpClient
  ) {
    this.coverData = combineLatest([
      this.isDisplayCover(),
      this.responsiveCoverSizeService.getCoverCssClass(),
      this.track$.asObservable(),
    ]).pipe(
      map((result) => {
        return {
          isDisplayCover: result[0],
          coverSizeClass: result[1],
          track: result[2],
          coverAvailable: false,
        } as CoverData;
      }),
      concatMap((coverData) => {
        return this.http
          .head(coverData.track.coverUrl, { observe: "response" })
          .pipe(
            map((response) => {
              coverData.coverAvailable = response.status === 200;
              return coverData;
            })
          );
      })
    );
    this.coverData.subscribe((coverData) => {
      console.log("coverData", coverData);
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

  private isDisplayCover() {
    return combineLatest([
      this.frontendSettingsService.settings$.pipe(
        map((settings) => settings.displayCovers)
      ),
      this.state$.pipe(map((state) => state !== "stop")),
    ]).pipe(
      map((result) => {
        return result[0] === true && result[1] === true;
      })
    );
  }
}
