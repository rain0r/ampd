import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, throwError } from "rxjs/index";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { MpdService } from "../../shared/services/mpd.service";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements OnInit {
  coverSizeClass: Observable<string>;
  currentState = "stop";
  currentSong = new QueueTrack();
  hasCover = new BehaviorSubject<boolean>(false);

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private mpdService: MpdService
  ) {
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.getSongSubscription();
    this.getStateSubscription();
  }

  ngOnInit(): void {
    this.updateCover();
  }

  openCoverModal(): void {
    // this.dialog.open(CoverModalComponent, {
    //   data: { coverUrl: this.currentSong.coverUrl },
    // });
  }

  hasCoverObservable(): Observable<boolean> {
    return this.hasCover.asObservable();
  }

  private updateCover(): void {
    console.log("updateCover");
    this.hasCover.next(false);
    if (!this.currentSong.coverUrl) {
      this.hasCover.next(false);
      return;
    }
    this.http
      .head(this.currentSong.coverUrl, { observe: "response" })
      .pipe(
        catchError(() => {
          this.hasCover.next(false);
          return throwError("Not found");
        })
      )
      .subscribe(() => this.hasCover.next(true));
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
