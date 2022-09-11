import { HttpClient } from "@angular/common/http";
import { AfterViewChecked, Component } from "@angular/core";
import { InitDetail } from "lightgallery/lg-events";
import { LightGallery } from "lightgallery/lightgallery";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { filter, first, map } from "rxjs/operators";
import { LIGHTBOX_SETTINGS } from "src/app/shared/lightbox";
import { FrontendSettingsService } from "../../service/frontend-settings.service";
import { MessageService } from "../../service/message.service";
import { MpdService } from "../../service/mpd.service";
import { ResponsiveScreenService } from "../../service/responsive-screen.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { QueueTrack } from "../../shared/models/queue-track";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements AfterViewChecked {
  coverSizeClass: Observable<string>;
  currentState: Observable<string>;
  currentTrack = <QueueTrack>{};
  currentPathLink = ""; // encoded dir of the current playing track
  isDisplayCover: Observable<boolean>;
  lightboxSettings = LIGHTBOX_SETTINGS;

  private displayCover$ = new BehaviorSubject<boolean>(false);
  private lightGallery!: LightGallery;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private http: HttpClient,
    private mpdService: MpdService,
    private messageService: MessageService,
    private responsiveCoverSizeService: ResponsiveScreenService
  ) {
    this.isDisplayCover = this.displayCover$.asObservable();
    this.coverSizeClass = this.responsiveCoverSizeService.getCoverCssClass();
    this.currentState = this.mpdService.currentState;
    this.currentState.subscribe((val) => console.log(new Date(), val));
    this.buildMessageReceiver();
    this.buildTrackSubscription();
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
        next: () => this.coverAvailable(),
      });
  }

  private coverAvailable(): void {
    combineLatest([
      this.currentState,
      this.frontendSettingsService.settings$.pipe(
        map((settings) => settings.displayCovers)
      ),
    ])
      .pipe(first())
      .subscribe((result) => {
        this.displayCover$.next(
          result[0] !== "stop" && // Check state, we don't change the cover if the player has stopped
            result[1] === true // Check if cover-display is active in the frontend-settings
        );
      });
  }

  /**
   * Listens for track changes. If a new track is played, trigger the updateCover-method.
   */
  private buildTrackSubscription(): void {
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
