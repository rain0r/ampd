import { Component, HostListener } from "@angular/core";

import { RxStompService } from "@stomp/ng2-stompjs";
import { Router } from "@angular/router";
import { SettingsService } from "../shared/services/settings.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  isDarkTheme: Observable<boolean>;
  connState: Observable<number>;

  constructor(
    private rxStompService: RxStompService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.isDarkTheme = this.settingsService.isDarkTheme;
    this.connState = rxStompService.connectionState$;
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
}
