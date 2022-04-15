import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { HttpClient } from "@angular/common/http";
import { AfterViewChecked, Component } from "@angular/core";
import { InitDetail } from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
import { LIGHTBOX_SETTINGS } from "src/app/shared/lightbox";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { QueueTrack } from "../../shared/models/queue-track";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";
import { MessageService } from "../../shared/services/message.service";
import { MpdService } from "../../shared/services/mpd.service";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements AfterViewChecked {
  coverSizeClass: Observable<string>;
  currentState: Observable<string>;
  currentTrackObsv = new Observable<QueueTrack>();
  currentPathLink = ""; // encoded dir of the current playing track
  isDisplayCover: Observable<boolean>;
  isMobile = false;
  lightboxSettings = LIGHTBOX_SETTINGS;

  private displayCover$ = new BehaviorSubject<boolean>(false);
  private lightGallery!: LightGallery;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private http: HttpClient,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private mpdService: MpdService,
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isDisplayCover = this.displayCover$.asObservable();
    this.coverSizeClass = this.responsiveCoverSizeService.getCoverCssClass();
    this.currentState = this.mpdService.currentState;
    this.buildMessageReceiver();
    this.buildTrackSubscription();

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngAfterViewChecked(): void {
    if (this.lightGallery) {
      this.lightGallery.refresh();
    }
  }

  onInit = (detail: InitDetail): void => {
    this.lightGallery = detail.instance;
  };

  private updateCover(): void {
    this.currentTrackObsv
      .pipe(map((track) => track.coverUrl))
      .subscribe((coverUrl) => {
        this.http.head(coverUrl, { observe: "response" }).subscribe({
          error: () => this.displayCover$.next(false),
          complete: () => this.coverAvailable(),
        });
      });
  }

  private coverAvailable(): void {
    combineLatest([
      this.currentState,
      this.frontendSettingsService.displayCovers,
    ])
      .pipe(
        distinctUntilChanged(
          (prev, curr) => prev[0] === curr[0] && prev[1] === prev[1]
        )
      )
      .subscribe((result) => {
        if (
          result[0] !== "stop" && // Check state, we don't change the cover if the player has stopped
          result[1] === true // Check if cover-display is active in the frontend-settings
        ) {
          this.displayCover$.next(true);
        }
      });
  }

  /**
   * Listens for track changes. If a new track is played, trigger the updateCover-method.
   */
  private buildTrackSubscription(): void {
    this.mpdService.currentTrack
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            (prev.artistName === curr.artistName &&
              prev.title !== curr.artistName) ||
            prev.file === curr.file
        )
      )
      .subscribe((track) => {
        this.currentTrackObsv = of(track);
        this.currentPathLink = encodeURIComponent(track.dir);
        this.updateCover();
      });
  }

  /**
   * Listens for internal messages. If we get the message to update the cover, call the method.
   */
  private buildMessageReceiver(): void {
    this.messageService.message
      .pipe(filter((msg) => msg.type === InternalMessageType.UpdateCover))
      .subscribe(() => this.updateCover());
  }
}
