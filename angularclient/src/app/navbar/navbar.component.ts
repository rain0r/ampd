import { Component, HostListener } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { BehaviorSubject, first, map, Observable } from "rxjs";
import { SearchComponent } from "../search/search.component";
import { ControlPanelService } from "../service/control-panel.service";
import { FrontendSettingsService } from "../service/frontend-settings.service";
import { MpdModeService } from "../service/mpd-mode.service";
import { MpdService } from "../service/mpd.service";
import { NotificationService } from "../service/notification.service";
import { QueueService } from "../service/queue.service";
import { ResponsiveScreenService } from "../service/responsive-screen.service";
import { VolumeService } from "../service/volume.service";
import { AmpdRxStompService } from "./../service/ampd-rx-stomp.service";
import { HelpDialogComponent } from "./help-dialog/help-dialog.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  connState: Observable<number>;
  darkTheme: Observable<boolean>;
  private isMobile = new Observable<boolean>();
  private currentState = "stop";
  private helpDialogOpen = new BehaviorSubject(false);
  private searchDialogOpen = new BehaviorSubject(false);
  private addStreamDialogOpen = new BehaviorSubject(false);

  constructor(
    private controlPanelService: ControlPanelService,
    private dialog: MatDialog,
    private frontendSettingsService: FrontendSettingsService,
    private mpdModeService: MpdModeService,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService,
    private router: Router,
    private rxStompService: AmpdRxStompService,
    private volumeService: VolumeService
  ) {
    this.connState = this.rxStompService.connectionState$;
    this.mpdService.currentState.subscribe(
      (state) => (this.currentState = state)
    );
    this.isMobile = this.responsiveScreenService.isMobile();
    this.darkTheme = this.frontendSettingsService.settings$.pipe(
      map((settings) => settings.darkTheme)
    );
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyDown($event: KeyboardEvent): void {
    const inputElement = $event.target as HTMLInputElement;

    /* We ignore keys coming from input fields */
    if (
      inputElement.tagName === "MAT-SLIDER" ||
      inputElement.tagName === "INPUT"
    ) {
      return;
    }

    /* We don't want to interfere with non-ampd-shortcuts like Alt+Tab or Ctrl+R */
    if ($event.ctrlKey || $event.metaKey) {
      return;
    }

    /* We don't want to interfere with tab changes */
    if ($event.altKey) {
      return;
    }

    switch ($event.key) {
      // Player controls
      case "<":
      case "ArrowLeft": // Left: Previous track
        this.controlPanelService.prev();
        break;
      case ">":
      case "ArrowRight": // Right: Next track
        this.controlPanelService.next();
        break;
      case "p":
      case " ": // Space or 'p': pause
        this.togglePause();
        break;
      case "s": // Stop the player
        this.stop();
        break;
      // Navigate to another view
      case "1":
        void this.router.navigate(["/"]);
        break;
      case "2":
        void this.router.navigate(["/browse"]);
        break;
      case "3":
      case "S":
        this.openSearchDialog();
        break;
      case "4":
        void this.router.navigate(["/settings"]);
        break;
      // MPD modes controls
      case "r":
        this.mpdModeService.toggleCtrlFromInput("repeat");
        break;
      case "z":
        this.mpdModeService.toggleCtrlFromInput("random");
        break;
      case "y":
        this.mpdModeService.toggleCtrlFromInput("single");
        break;
      case "R":
        this.mpdModeService.toggleCtrlFromInput("consume");
        break;
      case "x":
        this.mpdModeService.toggleCtrlFromInput("crossfade");
        break;
      // Display help dialog
      case "h":
      case "?":
        this.openHelpDialog();
        break;
      // Decrease / increase volume
      case "+":
        this.volumeService.increaseVolume();
        break;
      case "-":
        this.volumeService.decreaseVolume();
        break;
      // Clear queue
      case "C":
        this.queueService.clearQueue();
        this.notificationService.popUp("Cleared queue");
        break;
      default:
        // Ignore it
        return;
    }

    $event.preventDefault();
  }

  openSearchDialog(): void {
    this.isMobile.subscribe((isMobile) => {
      if (isMobile) {
        void this.router.navigate(["search"]);
        return;
      }

      this.searchDialogOpen
        .asObservable()
        .pipe(first())
        .subscribe((open) => {
          if (!open) {
            this.searchDialogOpen.next(true);
            const dialogRef = this.dialog.open(SearchComponent, {
              autoFocus: true,
              height: "75%",
              width: "75%",
            });
            dialogRef
              .afterClosed()
              .subscribe(() => this.searchDialogOpen.next(false));
          }
        });
    });
  }

  openHelpDialog(): void {
    this.helpDialogOpen
      .asObservable()
      .pipe(first())
      .subscribe((open) => {
        if (!open) {
          this.helpDialogOpen.next(true);
          const dialogRef = this.dialog.open(HelpDialogComponent, {
            autoFocus: true,
            height: "75%",
            width: "75%",
          });
          dialogRef
            .afterClosed()
            .subscribe(() => this.helpDialogOpen.next(false));
        }
      });
  }

  private togglePause(): void {
    if (this.currentState === "pause" || this.currentState === "stop") {
      this.controlPanelService.play();
    } else if (this.currentState === "play") {
      this.controlPanelService.pause();
    }
  }

  private stop(): void {
    this.controlPanelService.stop();
  }
}
