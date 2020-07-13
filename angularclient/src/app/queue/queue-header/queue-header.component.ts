import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, throwError } from "rxjs/index";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { catchError } from "rxjs/operators";
import { CoverModalComponent } from "../../shared/cover-modal/cover-modal.component";
import { SettingsService } from "../../shared/services/settings.service";

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
    private settingsService: SettingsService
  ) {
    this.isDisplayCover = this.displayCoverSubject.asObservable();
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.getSongSubscription();
    this.getStateSubscription();
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
          return throwError("Not found");
        })
      )
      .subscribe(() => {
        if (
          this.currentState !== "stop" &&
          this.settingsService.isDisplayCovers()
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
}
