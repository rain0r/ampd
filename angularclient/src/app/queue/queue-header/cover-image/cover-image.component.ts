import { HttpClient } from "@angular/common/http";
import { AfterViewChecked, Component, Input, OnInit } from "@angular/core";
import { InitDetail } from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";
import { BehaviorSubject, combineLatest, map, Observable, Subject } from "rxjs";
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
export class CoverImageComponent implements OnInit, AfterViewChecked {
  @Input() set track(track: QueueTrack) {
    this.track$.next(track);
  }
  @Input() set state(state: string) {
    this.state$.next(state);
  }

  lightboxSettings = LIGHTBOX_SETTINGS;
  coverData = new Observable<CoverData>();
  isDisplayCover: Observable<boolean>;
  coverSizeClass: Observable<string>;
  myTrack: Observable<QueueTrack>;

  private firstTrack = true;
  private lightGallery!: LightGallery;
  private state$ = new BehaviorSubject<string>("stop");
  private track$ = new Subject<QueueTrack>();
  private coverData$ = new Subject<CoverData>();
  private displayCover$ = new BehaviorSubject<boolean>(false);

  constructor(
    private responsiveCoverSizeService: ResponsiveScreenService,
    private frontendSettingsService: FrontendSettingsService,
    private http: HttpClient
  ) {
    this.isDisplayCover = this.displayCover$.asObservable();
    this.coverSizeClass = this.responsiveCoverSizeService.getCoverCssClass();
    this.myTrack = this.track$.asObservable();
    // this.buildCover()

    // this.track$.asObservable()
    // .pipe(
    //   filter((track) => this.firstTrack === true || track.changed)
    // )
    // .subscribe((track) => {
    //   this.firstTrack = false;
    //   console.log(new Date(), track)
    // })
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
    this.buildCover2();
    console.log("state", this.state);
  }

  // private buildCover() {
  //   combineLatest([
  //     this._isDisplayCover(),
  //     this.responsiveCoverSizeService.getCoverCssClass(),
  //     this.track$.asObservable(),
  //   ])
  //     .pipe(
  //       map(([displayCover, cssClass, track]) => {
  //         return {
  //           isDisplayCover: displayCover,
  //           coverSizeClass: cssClass,
  //           track: track,
  //           coverAvailable: false,
  //         } as CoverData;
  //       }),
  //       filter((cv) => this.firstTrack === true ||cv.track.changed === true),
  //       tap((cv) => console.log("tap()", cv))
  //     )
  //     .subscribe((cv) => {
  //       this.firstTrack = false;

  //       console.log("cv", cv)

  //       // It seems like combineLatest is not triggered when in paused mode
  //       // Leads to an non-displayed cover
  //       // This is a hack to circumvent that
  //       if (cv.isDisplayCover === true) {
  //         this.isCoverAvailable(cv).subscribe(
  //           (head) => (this.coverData = of(head))
  //         );
  //       } else {
  //         this.coverData = of(cv);
  //       }
  //     });
  // }

  // private isCoverAvailable(coverData: CoverData): Observable<CoverData> {
  //   return this.http
  //     .head(coverData.track.coverUrl, { observe: "response" })
  //     .pipe(
  //       map((response) => {
  //         coverData.coverAvailable = response.status === 200;
  //         return coverData;
  //       })
  //     );
  // }

  // private _isDisplayCover() {
  //   return combineLatest([
  //     this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
  //     this.state$.pipe(map((state) => state !== "stop")),
  //   ]).pipe(
  //     map(([displayCover, notStopped]) =>
  //        displayCover === true && notStopped === true
  //     )
  //   );
  // }

  private buildCover2(): void {
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
    console.log(new Date(), "coverAvailable");
    this.state$
      .pipe(map((state) => state !== "stop"))
      .subscribe((state) => console.log("state", state));
    combineLatest([
      this.state$.asObservable(),
      this.frontendSettingsService.getBoolValue$(SettingKeys.DISPLAY_COVERS),
    ]).subscribe(([state, displayCovers]) => {
      console.log("state", state);
      this.displayCover$.next(
        state !== "stop" && // Check state, we don't change the cover if the player has stopped
          displayCovers === true // Check if cover-display is active in the frontend-settings
      );
    });
  }
}
