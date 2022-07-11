import { Component, HostListener } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { RxStompService } from "@stomp/ng2-stompjs";
import { BehaviorSubject, Observable } from "rxjs";
import { AddStreamModalComponent } from "../queue/add-stream-modal/add-stream-modal.component";
import { SearchComponent } from "../search/search.component";
import { ControlPanelService } from "../service/control-panel.service";
import { FrontendSettingsService } from "../service/frontend-settings.service";
import { MpdModeService } from "../service/mpd-mode.service";
import { MpdService } from "../service/mpd.service";
import { NotificationService } from "../service/notification.service";
import { QueueService } from "../service/queue.service";
import { ResponsiveScreenService } from "../service/responsive-screen.service";
import { VolumeService } from "../service/volume.service";
import { HelpModalComponent } from "./help-modal/help-modal.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  isDarkTheme: Observable<boolean>;
  connState: Observable<number>;
  private isMobile = new Observable<boolean>();
  private currentState = "stop";
  private helpModalOpen = new BehaviorSubject(false);
  private searchModalOpen = new BehaviorSubject(false);

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
    private rxStompService: RxStompService,
    private volumeService: VolumeService
  ) {
    this.isDarkTheme = this.frontendSettingsService.darkTheme;
    this.connState = this.rxStompService.connectionState$;
    this.mpdService.currentState.subscribe(
      (state) => (this.currentState = state)
    );
    this.isMobile = this.responsiveScreenService.isMobile();
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
        this.openSearchModal();
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
      // Display help modal
      case "h":
      case "?":
        this.openHelpModal();
        break;
      // Display add stream modal
      case "a":
        this.openAddStreamModal();
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

  openSearchModal(): void {
    this.isMobile.subscribe((isMobile) => {
      if (isMobile) {
        void this.router.navigate(["search"]);
      } else {
        if (!this.searchModalOpen.value) {
          this.searchModalOpen.next(true);
          const dialogRef = this.dialog.open(SearchComponent, {
            autoFocus: true,
            panelClass: this.frontendSettingsService.darkTheme$.value
              ? "dark-theme"
              : "",
            maxWidth: "100vw",
            maxHeight: "100vh",
            height: "100%",
            width: "100%",
          });
          dialogRef
            .afterClosed()
            .subscribe(() => this.searchModalOpen.next(false));
          dialogRef.updateSize("90%", "75%");
        }
      }
    });
  }

  openHelpModal(): void {
    if (!this.helpModalOpen.value) {
      this.helpModalOpen.next(true);
      const dialogRef = this.dialog.open(HelpModalComponent, {
        autoFocus: true,
        panelClass: this.frontendSettingsService.darkTheme$.value
          ? "dark-theme"
          : "",
      });
      dialogRef.afterClosed().subscribe(() => this.helpModalOpen.next(false));
    }
  }

  private togglePause(): void {
    if (this.currentState === "pause" || this.currentState === "stop") {
      this.controlPanelService.play();
    } else if (this.currentState === "play") {
      this.controlPanelService.pause();
    }
  }

  private openAddStreamModal(): void {
    this.dialog.open(AddStreamModalComponent, {
      panelClass: this.frontendSettingsService.darkTheme$.value
        ? "dark-theme"
        : "",
    });
  }

  private stop(): void {
    this.controlPanelService.stop();
  }
}
