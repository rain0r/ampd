import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";
import { HttpClient } from "@angular/common/http";
import { AfterViewChecked, Component, OnInit } from "@angular/core";
import { InitDetail } from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, map, take } from "rxjs/operators";
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
export class QueueHeaderComponent implements OnInit, AfterViewChecked {
  coverSizeClass: Observable<string>;
  currentState: Observable<string>;
  currentTrack = new QueueTrack();
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
    this.buildTrackChangeSubscription();
    this.buildMessageReceiver();

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.HandsetPortrait])
      .pipe(map((state: BreakpointState) => state.matches))
      .subscribe((isMobile) => (this.isMobile = isMobile));
  }

  ngOnInit(): void {
    this.updateCover();
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
    if (!this.currentTrack.coverUrl) {
      return;
    }
    this.http
      .head(this.currentTrack.coverUrl, { observe: "response" })
      .subscribe({
        error: () => this.displayCover$.next(false),
        complete: () => this.coverAvailable(),
        // () => void 0, // next
        // () => this.displayCover$.next(false), // error
        // () => this.coverAvailable() // complete
      });
  }

  private coverAvailable(): void {
    combineLatest([
      this.currentState,
      this.frontendSettingsService.displayCovers,
    ])
      .pipe(take(1))
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
  private buildTrackChangeSubscription(): void {
    let first = true;
    this.mpdService.currentTrack.subscribe((queueTrack) => {
      this.currentTrack = queueTrack;
      this.currentPathLink = encodeURIComponent(queueTrack.dir);
      if (first || queueTrack.changed) {
        first = false;
        this.updateCover();
      }
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
