import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

import {ResponsiveCoverSizeService} from "../../shared/services/responsive-cover-size.service";
import {QueueTrack} from "../../shared/models/queue-track";
import {MpdService} from "../../shared/services/mpd.service";
import {filter, take} from "rxjs/operators";
import {CoverModalComponent} from "../cover-modal/cover-modal.component";
import {SettingsService} from "../../shared/services/settings.service";
import {MessageService} from "../../shared/services/message.service";
import {InternalMessageType} from "../../shared/messages/internal/internal-message-type.enum";
import {BehaviorSubject, combineLatest, Observable} from "rxjs";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements OnInit {
  coverSizeClass: Observable<string>;
  currentState: Observable<string>;
  currentTrack = new QueueTrack();
  isDisplayCover: Observable<boolean>;
  private displayCover$ = new BehaviorSubject<boolean>(false);

  constructor(
      private dialog: MatDialog,
      private http: HttpClient,
      private responsiveCoverSizeService: ResponsiveCoverSizeService,
      private mpdService: MpdService,
      private settingsService: SettingsService,
      private messageService: MessageService
  ) {
    this.isDisplayCover = this.displayCover$.asObservable();
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.currentState = this.mpdService.currentState;
    this.getTrackSubscription();
    this.buildMessageReceiver();
  }

  ngOnInit(): void {
    this.updateCover();
  }

  openCoverModal(): void {
    this.dialog.open(CoverModalComponent, {
      autoFocus: false,
      data: this.currentTrack,
      panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
    });
  }

  private updateCover(): void {
    if (!this.currentTrack.coverUrl) {
      return;
    }
    this.http
    .head(this.currentTrack.coverUrl, {observe: "response"})
    .subscribe(
        () => void 0,
        () => this.displayCover$.next(false),
        () => this.coverAvailable()
    );
  }

  private coverAvailable(): void {
    combineLatest([this.currentState, this.settingsService.isDisplayCovers])
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
  private getTrackSubscription(): void {
    let first = true;
    this.mpdService.currentTrack.subscribe((queueTrack) => {
      console.log("got a track", queueTrack)
      this.currentTrack = queueTrack;
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
