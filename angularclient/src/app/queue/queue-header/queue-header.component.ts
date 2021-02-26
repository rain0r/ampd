import {HttpClient} from "@angular/common/http";
import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

import {ResponsiveCoverSizeService} from "../../shared/services/responsive-cover-size.service";
import {QueueTrack} from "../../shared/models/queue-track";
import {MpdService} from "../../shared/services/mpd.service";
import {catchError, filter, map} from "rxjs/operators";
import {CoverModalComponent} from "../cover-modal/cover-modal.component";
import {SettingsService} from "../../shared/services/settings.service";
import {MessageService} from "../../shared/services/message.service";
import {InternalMessageType} from "../../shared/messages/internal/internal-message-type.enum";
import {FilterMessage} from "../../shared/messages/internal/message-types/filter-message";
import {BehaviorSubject, combineLatest, Observable, of, throwError,} from "rxjs";
import {Title} from "@angular/platform-browser";
import {DISPLAY_COVERS_KEY} from "../../shared/local-storage-keys";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements OnInit {
  coverSizeClass: Observable<string>;
  currentState: Observable<string>;
  currentSong = new QueueTrack();
  isDisplayCover: Observable<boolean>;
  private displayCoverSubject = new BehaviorSubject<boolean>(false);

  constructor(
      private dialog: MatDialog,
      private http: HttpClient,
      private responsiveCoverSizeService: ResponsiveCoverSizeService,
      private mpdService: MpdService,
      private settingsService: SettingsService,
      private messageService: MessageService,
      private titleService: Title
  ) {
    this.isDisplayCover = this.displayCoverSubject.asObservable();
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.getSongSubscription();
    this.getStateSubscription();
    this.buildMessageReceiver();
  }

  ngOnInit(): void {
    this.updateCover();
  }

  openCoverModal(): void {
    this.dialog.open(CoverModalComponent, {
      autoFocus: false,
      data: this.currentSong,
    });
  }

  private updateCover(): void {
    if (!this.currentSong.coverUrl) {
      return;
    }

    const httpObs = this.http
    .head(this.currentSong.coverUrl, {observe: "response"})
    .pipe(
        catchError(() => {
          this.displayCoverSubject.next(false);
          return throwError("Not found");
        })
    );
    combineLatest([
      httpObs,
      this.currentState,
      of(this.settingsService.getBoolValue(DISPLAY_COVERS_KEY, true)),
    ])
    .pipe(filter((result) => result[1] !== "stop"))
    .subscribe(() => this.displayCoverSubject.next(true));
  }

  private getSongSubscription() {
    let first = true;
    this.mpdService.getTrackSubscription().subscribe((queueTrack) => {
      this.currentSong = queueTrack;
      if (first || queueTrack.changed) {
        first = false;
        this.updateCover();
      }
    });
  }

  private getStateSubscription() {
    this.currentState = this.mpdService.getStateSubscription();
  }

  private buildMessageReceiver() {
    this.messageService
    .getMessage()
    .pipe(
        filter((msg) => msg.type === InternalMessageType.UpdateCover),
        map((msg) => msg as FilterMessage)
    )
    .subscribe(() => this.updateCover());
  }
}
