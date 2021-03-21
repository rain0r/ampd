import { Component, HostListener } from "@angular/core";

import { RxStompService } from "@stomp/ng2-stompjs";
import { Router } from "@angular/router";
import { SettingsService } from "../shared/services/settings.service";
import { BehaviorSubject, Observable } from "rxjs";
import { MpdService } from "../shared/services/mpd.service";
import { MpdModeService } from "../shared/services/mpd-mode.service";
import { MatDialog } from "@angular/material/dialog";
import { HelpModalComponent } from "./help-dialog/help-modal.component";
import { NotificationService } from "../shared/services/notification.service";
import { ControlPanelService } from "../shared/services/control-panel.service";
import { VolumeService } from "../shared/services/volume.service";
import { QueueService } from "../shared/services/queue.service";
import { AddStreamModalComponent } from "../queue/add-stream-modal/add-stream-modal.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  isDarkTheme: Observable<boolean> = new Observable<boolean>();
  connState: Observable<number> = new Observable<number>();
  private currentState = "stop";
  private helpModalOpen = new BehaviorSubject(false);

  constructor(
    private controlPanelService: ControlPanelService,
    private dialog: MatDialog,
    private mpdModeService: MpdModeService,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    private queueService: QueueService,
    private router: Router,
    private rxStompService: RxStompService,
    private settingsService: SettingsService,
    private volumeService: VolumeService
  ) {
    this.isDarkTheme = this.settingsService.isDarkTheme;
    this.connState = rxStompService.connectionState$;
    this.mpdService.currentState.subscribe(
      (state) => (this.currentState = state)
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
      // Navigate to another view
      case "1":
        void this.router.navigate(["/"]);
        break;
      case "2":
        void this.router.navigate(["/browse"]);
        break;
      case "3":
        void this.router.navigate(["/search"]);
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
  }

  private openHelpModal(): void {
    if (!this.helpModalOpen.value) {
      this.helpModalOpen.next(true);
      const dialogRef = this.dialog.open(HelpModalComponent, {
        autoFocus: true,
        panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
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
      panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
    });
  }
}
