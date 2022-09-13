import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { BehaviorSubject, combineLatest, first, map, Observable } from "rxjs";
import { TrackInfoModalComponent } from "src/app/browse/tracks/track-info-modal/track-info-modal.component";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { ControlPanelService } from "../../service/control-panel.service";
import { MpdService } from "../../service/mpd.service";
import { NotificationService } from "../../service/notification.service";
import { QueueService } from "../../service/queue.service";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent implements OnInit {
  currentState: Observable<string>;
  isMobile = new Observable<boolean>();
  private trackInfoModalOpen = new BehaviorSubject(false);

  constructor(
    private controlPanelService: ControlPanelService,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService,
    private dialog: MatDialog
  ) {
    this.currentState = this.mpdService.currentState;
  }

  ngOnInit(): void {
    this.isMobile = this.responsiveScreenService.isMobile();
  }

  handleControlButton(event: MouseEvent): void {
    const element = event.currentTarget as HTMLInputElement;
    switch (element.id) {
      case "btn-prev":
        this.controlPanelService.prev();
        break;
      case "btn-stop":
        this.controlPanelService.stop();
        break;
      case "btn-pause":
        this.controlPanelService.pause();
        break;
      case "btn-play":
        this.controlPanelService.play();
        break;
      case "btn-next":
        this.controlPanelService.next();
        break;
      default:
        // Ignore it
        return;
    }
  }

  onClearQueue(): void {
    this.queueService.clearQueue();
    this.notificationService.popUp("Cleared queue");
  }

  onShowTrackInfo(): void {
    combineLatest([
      this.isMobile,
      this.mpdService.currentTrack,
      this.trackInfoModalOpen.asObservable(),
    ])
      .pipe(
        map((results) => ({
          isMobile: results[0],
          track: results[1],
          errorModalOpen: results[2],
        })),
        first()
      )
      .subscribe((result) => {
        const width = result.isMobile ? "100%" : "70%";
        const options: MatDialogConfig = {
          maxWidth: "100vw",
          height: "90%",
          width: width,
          data: result.track,
        };
        if (result.isMobile) {
          options["height"] = "75%";
          options["maxHeight"] = "75vh";
        }
        if (!result.errorModalOpen) {
          const dialogRef = this.dialog.open(TrackInfoModalComponent, options);
          this.trackInfoModalOpen.next(true);
          dialogRef
            .afterClosed()
            .subscribe(() => this.trackInfoModalOpen.next(false));
        }
      });
  }
}
