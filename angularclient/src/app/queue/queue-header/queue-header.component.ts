import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { filter, map, take } from "rxjs/operators";
import { CoverModalComponent } from "../cover-modal/cover-modal.component";
import { MessageService } from "../../shared/services/message.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from "@angular/cdk/layout";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements OnInit {
  coverSizeClass: Observable<string>;
  currentState: Observable<string>;
  currentTrack = new QueueTrack();
  currentPathLink = ""; // encoded dir of the current playing track
  isDisplayCover: Observable<boolean>;
  isMobile = false;
  private displayCover$ = new BehaviorSubject<boolean>(false);

  constructor(
    private dialog: MatDialog,
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

  openCoverModal(): void {
    let width = 50;
    let height = 75;

    if (this.isMobile) {
      width = 100;
      height = 75;
    }

    const dialogRef = this.dialog.open(CoverModalComponent, {
      autoFocus: false,
      data: this.currentTrack,
      panelClass: this.frontendSettingsService.darkTheme$.value
        ? "dark-theme"
        : "",
      maxWidth: "100vw",
      maxHeight: "100vh",
      height: "100%",
      width: "100%",
    });
    dialogRef.updateSize(`${width}%`, `${height}%`);
  }

  private updateCover(): void {
    if (!this.currentTrack.coverUrl) {
      return;
    }
    this.http
      .head(this.currentTrack.coverUrl, { observe: "response" })
      .subscribe(
        () => void 0,
        () => this.displayCover$.next(false),
        () => this.coverAvailable()
      );
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
