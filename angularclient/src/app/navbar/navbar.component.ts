import { Component, HostListener } from "@angular/core";

import { RxStompService } from "@stomp/ng2-stompjs";
import { Router } from "@angular/router";
import { SettingsService } from "../shared/services/settings.service";
import { BehaviorSubject, Observable } from "rxjs";
import { MpdCommands } from "../shared/mpd/mpd-commands.enum";
import { MpdService } from "../shared/services/mpd.service";
import { WebSocketService } from "../shared/services/web-socket.service";
import { MpdModeService } from "../shared/services/mpd-mode.service";
import { MatDialog } from "@angular/material/dialog";
import { HelpModalComponent } from "./help-dialog/help-modal.component";
import { NotificationService } from "../shared/services/notification.service";

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
    private dialog: MatDialog,
    private mpdModeService: MpdModeService,
    private mpdService: MpdService,
    private notificationService: NotificationService,
    private router: Router,
    private rxStompService: RxStompService,
    private settingsService: SettingsService,
    private webSocketService: WebSocketService
  ) {
    this.isDarkTheme = this.settingsService.isDarkTheme;
    this.connState = rxStompService.connectionState$;
    this.mpdService.currentState.subscribe(
      (state) => (this.currentState = state)
    );
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;

    /* We ignore keys coming from input fields */
    if (
      inputElement.tagName === "MAT-SLIDER" ||
      inputElement.tagName === "INPUT"
    ) {
      return;
    }

    switch (event.key) {
      // Player controls
      case "<":
      case "ArrowLeft": // Left: Previous track
        this.webSocketService.send(MpdCommands.SET_PREV);
        break;
      case ">":
      case "ArrowRight": // Right: Next track
        this.webSocketService.send(MpdCommands.SET_NEXT);
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
      // Decrease / increase volume
      case "+":
        this.mpdService.increaseVolume();
        break;
      case "-":
        this.mpdService.decreaseVolume();
        break;
      // Clear queue
      case "C":
        this.mpdService.clearQueue();
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
        height: "75%",
        width: "80%",
        panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
      });
      dialogRef.afterClosed().subscribe(() => this.helpModalOpen.next(false));
    }
  }

  private togglePause(): void {
    let command;
    if (this.currentState === "pause") {
      command = MpdCommands.SET_PLAY;
    } else if (this.currentState === "play") {
      command = MpdCommands.SET_PAUSE;
    }
    if (command) {
      this.webSocketService.send(command);
    }
  }
}
