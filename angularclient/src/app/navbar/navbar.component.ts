import { Component, HostListener } from "@angular/core";

import { RxStompService } from "@stomp/ng2-stompjs";
import { Router } from "@angular/router";
import { SettingsService } from "../shared/services/settings.service";
import { Observable } from "rxjs";
import { MpdCommands } from "../shared/mpd/mpd-commands.enum";
import { MpdService } from "../shared/services/mpd.service";
import { WebSocketService } from "../shared/services/web-socket.service";
import { MpdModeService } from "../shared/services/mpd-mode.service";

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

  @HostListener("document:keydown.1", ["$event"])
  on1KeydownHandler(event: KeyboardEvent): void {
    // Ignore events that come from input elements
    const isFromInput = (event.target as HTMLInputElement).tagName === "INPUT";
    if (!isFromInput) {
      event.preventDefault();
      // Go to the queue view
      void this.router.navigate(["/"]);
    }
  }

  @HostListener("document:keydown.2", ["$event"])
  on2KeydownHandler(event: KeyboardEvent): void {
    // Ignore events that come from input elements
    const isFromInput = (event.target as HTMLInputElement).tagName === "INPUT";
    if (!isFromInput) {
      event.preventDefault();
      // Go to the browse view
      void this.router.navigate(["/browse"]);
    }
  }

  @HostListener("document:keydown.3", ["$event"])
  on3KeydownHandler(event: KeyboardEvent): void {
    // Ignore events that come from input elements
    const isFromInput = (event.target as HTMLInputElement).tagName === "INPUT";
    if (!isFromInput) {
      event.preventDefault();
      // Go to the search view
      void this.router.navigate(["/search"]);
    }
  }

  @HostListener("document:keydown.4", ["$event"])
  on4KeydownHandler(event: KeyboardEvent): void {
    // Ignore events that come from input elements
    const isFromInput = (event.target as HTMLInputElement).tagName === "INPUT";
    if (!isFromInput) {
      event.preventDefault();
      // Go to the settings view
      void this.router.navigate(["/settings"]);
    }
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

    let command;
    switch (event.key) {
      case "ArrowLeft": // Left: Previous track
        command = MpdCommands.SET_PREV;
        break;
      case "ArrowRight": // Right: Next track
        command = MpdCommands.SET_NEXT;
        break;
      case "p":
      case " ": // Space or 'p': pause
        if (this.currentState === "pause") {
          command = MpdCommands.SET_PLAY;
        } else if (this.currentState === "play") {
          command = MpdCommands.SET_PAUSE;
        }
        break;
      case "z":
        console.log("catched z");
        this.mpdModeService.toggleCtrlFromInput("random");
        break;
      default:
        // Ignore it
        return;
    }
    if (command) {
      this.webSocketService.send(command);
      event.preventDefault();
    }
  }
}
