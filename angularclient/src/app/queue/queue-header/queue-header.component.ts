import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, throwError } from "rxjs/index";
import { CoverModalComponent } from "../../shared/cover-modal/cover-modal.component";
import { ResponsiveCoverSizeService } from "../../shared/services/responsive-cover-size.service";
import { QueueTrack } from "../../shared/models/queue-track";
import { catchError, filter, map } from "rxjs/operators";
import { MessageService } from "../../shared/services/message.service";
import { InternalMessageType } from "../../shared/messages/internal/internal-message-type.enum";
import { SongChangedMessage } from "../../shared/messages/internal/message-types/song-changed-message";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent implements OnInit {
  coverSizeClass: Observable<string>;
  @Input() currentSong: QueueTrack;
  @Input() currentState: string;
  hasCover = false;
  newSong: Observable<QueueTrack>;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private responsiveCoverSizeService: ResponsiveCoverSizeService,
    private messageService: MessageService
  ) {
    this.coverSizeClass = responsiveCoverSizeService.getCoverCssClass();
    this.newSong = this.getSongChangedSubscription();
  }

  ngOnInit(): void {
    this.checkCoverUrl();
  }

  openCoverModal(): void {
    this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl },
    });
  }

  private checkCoverUrl(): void {
    console.log("checkCoverUrl");
    const obs = {
      error: () => (this.hasCover = false),
      complete: () => (this.hasCover = true),
    };
    if (!this.currentSong.coverUrl) {
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
    // this.http
    // .get(this.currentSong.coverUrl, {observe: 'response'})
    // .subscribe({
    //   error: () => {
    //     console.error(`Error loading cover: `);
    //   },
    //   complete: () => {
    //     console.log(`Complete`);
    //   },
    // });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  private getSongChangedSubscription() {
    return this.messageService.getMessage().pipe(
      filter((msg) => msg.type === InternalMessageType.SongChanged),
      map((msg: SongChangedMessage) => msg.song)
    );
  }
}
