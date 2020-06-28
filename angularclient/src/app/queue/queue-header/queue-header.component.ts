import { HttpClient, HttpErrorResponse } from "@angular/common/http";
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
  private _hasCover = new BehaviorSubject<boolean>(false);
  coverSizeClass: Observable<string>;
  currentState = "stop";
  currentSong = new QueueTrack();

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

  get hasCover(): Observable<boolean> {
    return this._hasCover.asObservable();
  }

  private updateCover(): void {
    console.log("updateCover: ", this.currentSong.coverUrl);

    if (!this.currentSong.coverUrl) {
      this._hasCover.next(false);
      return;
    }
    this.http
      .head(this.currentSong.coverUrl, { observe: "response" })
      .pipe(catchError(this.handleError))
      .subscribe((resp) => {
        // display its headers
        console.log(`Headers for: ${this.currentSong.coverUrl}`);
        const keys = resp.headers.keys();
        const headers = keys.map((key) => `${key}: ${resp.headers.get(key)}`);
        console.log("headers:", headers);
      });
    this.http
      .get(this.currentSong.coverUrl, { observe: "response" })
      .subscribe({
        error: () => {
          console.error(`Error loading cover: `);
        },
        complete: () => {
          console.log(`Complete`);
        },
      });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: `,
        error
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  private getSongSubscription() {
    this.mpdService.getSongSubscription().subscribe((queueTrack) => {
      this.currentSong = queueTrack;
      this.updateCover();
      // if (queueTrack.changed) {
      //   this.updateCover();
      // }
    });
  }

  private getStateSubscription() {
    this.mpdService
      .getStateSubscription()
      .subscribe((state) => (this.currentState = state));
  }
}
