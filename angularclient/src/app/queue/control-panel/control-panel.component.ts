import { Component, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, combineLatest, first, map, of, switchMap } from "rxjs";
import { TrackInfoDialogComponent } from "src/app/browse/tracks/track-info-dialog/track-info-dialog.component";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";
import { ControlPanelService } from "../../service/control-panel.service";
import { MpdService } from "../../service/mpd.service";
import { NotificationService } from "../../service/notification.service";
import { QueueService } from "../../service/queue.service";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
  imports: [MatButton, MatIcon, AsyncPipe],
})
export class ControlPanelComponent implements OnInit {
  private controlPanelService = inject(ControlPanelService);
  private dialog = inject(MatDialog);
  private fsSettings = inject(FrontendSettingsService);
  private mpdService = inject(MpdService);
  private notificationService = inject(NotificationService);
  private queueService = inject(QueueService);
  private responsiveScreenService = inject(ResponsiveScreenService);

  connected$: Observable<boolean>;
  currentState: Observable<string>;
  displayInfoBtn: Observable<boolean>;
  displayJumpBtn: boolean;
  isMobile = new Observable<boolean>();
  queueTrackCount: Observable<number>;

  constructor() {
    this.connected$ = this.mpdService.isConnected$();
    this.currentState = this.mpdService.currentState$;
    this.queueTrackCount = this.mpdService.getQueueTrackCount$();
    this.displayInfoBtn = this.isDisplayInfoBtn();
    this.displayJumpBtn = this.isDisplayJumpBtn();
  }

  ngOnInit(): void {
    this.isMobile = this.responsiveScreenService.isMobile();
  }

  isDisplayInfoBtn(): Observable<boolean> {
    return combineLatest([
      this.fsSettings.getBoolValue$(SettingKeys.DISPLAY_INFO_BTN),
      this.currentState,
      this.mpdService.isCurrentTrackRadioStream$(),
    ]).pipe(
      switchMap(([displayInfoBtn, status, isStream]) =>
        of(
          displayInfoBtn === true &&
            (status === "play" || status === "pause") &&
            isStream === false,
        ),
      ),
    );
  }

  isDisplayJumpBtn(): boolean {
    return this.fsSettings.getIntValue(SettingKeys.JUMP_SEEK) > 0;
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
      case "btn-seek-backwards":
        this.controlPanelService.seekJumpBtnListener(true);
        break;
      case "btn-seek-forward":
        this.controlPanelService.seekJumpBtnListener(false);
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
    combineLatest([this.isMobile, this.mpdService.currentTrack$])
      .pipe(
        map((results) => ({
          isMobile: results[0],
          track: results[1],
        })),
        first(),
      )
      .subscribe((result) => {
        this.dialog.open(TrackInfoDialogComponent, {
          data: result.track,
          width: "80%",
        });
      });
  }
}
