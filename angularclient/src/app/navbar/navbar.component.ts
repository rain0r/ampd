import { Component, HostListener } from "@angular/core";

import { RxStompService } from "@stomp/ng2-stompjs";
import { Router } from "@angular/router";
import { SettingsService } from "../shared/services/settings.service";
import { Observable } from "rxjs";
import { MpdCommands } from "../shared/mpd/mpd-commands.enum";
import { MpdService } from "../shared/services/mpd.service";
import { WebSocketService } from "../shared/services/web-socket.service";
import { MpdModeService } from "../shared/services/mpd-mode.service";
import { MatDialog } from "@angular/material/dialog";
import { HelpModalComponent } from "./help-dialog/help-modal.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  isDarkTheme: Observable<boolean>;
  connState: Observable<number>;
  private currentState = "stop";

  constructor(
    private dialog: MatDialog,
    private mpdModeService: MpdModeService,
    private mpdService: MpdService,
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
    if (inputElement.tagName === "MAT-SLIDER") {
      /* We want to change the volume (with the keyboard) - not skip the track. */
      return;
    }

    if (inputElement.tagName === "INPUT") {
      /* We want to search for something - not skip the track. */
      return;
    }

    switch (event.key) {
      // Player controls
      case "ArrowLeft": // Left: Previous track
        this.webSocketService.send(MpdCommands.SET_PREV);
        break;
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
      default:
        // Ignore it
        return;
    }
  }

  private openHelpModal(): void {
    this.dialog.open(HelpModalComponent, {
      autoFocus: true,
      height: "50%",
      width: "80%",
      panelClass: this.settingsService.isDarkTheme$.value ? "dark-theme" : "",
    });
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
