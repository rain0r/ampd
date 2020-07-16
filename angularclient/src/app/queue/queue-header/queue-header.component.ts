import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, throwError } from "rxjs/index";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { catchError, filter, map } from "rxjs/operators";
import { CoverModalComponent } from "../cover-modal/cover-modal.component";
import {
  DISPLAY_COVERS_KEY,
  SettingsService,
} from "../../shared/services/settings.service";
import { MessageService } from "../../shared/services/message.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { FilterMessage } from "../../shared/messages/internal/message-types/filter-message";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements OnInit {
  coverSizeClass: Observable<string>;
  currentState = "stop";
  currentSong = new QueueTrack();
  isDisplayCover: Observable<boolean>;
  private displayCoverSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private mpdService: MpdService,
    private settingsService: SettingsService,
    private messageService: MessageService
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
    this.http
      .head(this.currentSong.coverUrl, { observe: "response" })
      .pipe(
        catchError(() => {
          this.displayCoverSubject.next(false);
          return throwError("Not found");
        })
      )
      .subscribe(() => {
        if (
          this.currentState !== "stop" &&
          this.settingsService.getBoolValue(DISPLAY_COVERS_KEY, true)
        ) {
          this.displayCoverSubject.next(true);
        }
      });
  }

  private getSongSubscription() {
    let first = true;
    this.mpdService.getSongSubscription().subscribe((queueTrack) => {
      this.currentSong = queueTrack;
      if (first || queueTrack.changed) {
        first = false;
        this.updateCover();
      }
    });
  }

  private getStateSubscription() {
    this.mpdService
      .getStateSubscription()
      .subscribe((state) => (this.currentState = state));
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
