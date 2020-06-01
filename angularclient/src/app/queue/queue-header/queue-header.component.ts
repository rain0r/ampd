import {HttpClient} from "@angular/common/http";
import {Component, Input} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs/index";
import {UPDATE_COVER} from "../../shared/commands/internal";
import {CoverModalComponent} from "../../shared/cover-modal/cover-modal.component";
import {QueueTrack} from "../../shared/models/queue-track";
import {MessageService} from "../../shared/services/message.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent {
  @Input() currentSong: QueueTrack = new QueueTrack();
  @Input() currentState = "";
  coverSizeClass = "cover-sm";
  private hasCover = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private messageService: MessageService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.subscription = this.messageService
      .getMessage()
      .subscribe((message) => {
        if (message.type === UPDATE_COVER) {
          this.checkCoverUrl();
        }
      });
    this.setCoverCssClass();
  }

  openCoverModal(): void {
    this.dialog.open(CoverModalComponent, {
      data: { coverUrl: this.currentSong.coverUrl() },
    });
  }

  private setCoverCssClass(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.coverSizeClass = "cover-xsmall";
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.coverSizeClass = "cover-small";
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.coverSizeClass = "cover-medium";
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.coverSizeClass = "cover-large";
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.coverSizeClass = "cover-xlarge";
        }
      });
  }

  private checkCoverUrl(): void {
    const obs = {
      error: () => (this.hasCover = false),
      complete: () => (this.hasCover = true),
    };

    this.http.head(this.currentSong.coverUrl()).subscribe(obs);
  }
}
