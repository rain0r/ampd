import { Component, OnInit, inject } from "@angular/core";
import { interval } from "rxjs";
import { ThemingService } from "./service/theming.service";
import { NavbarComponent } from "./navbar/navbar.component";

declare global {
  // Maps a specific event name to an event type
  interface GlobalEventHandlersEventMap {
    "keydown.f": KeyboardEvent;
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  imports: [NavbarComponent],
})
export class AppComponent implements OnInit {
  private ts = inject(ThemingService);

  lightThemeEnabled;

  constructor() {
    this.lightThemeEnabled = this.ts.onLoad();
  }

  ngOnInit(): void {
    this.reloadTab();
  }

  private reloadTab(): void {
    const period =
      1000 * // milliseconds per second
      60 * // seconds per minute
      60 * // minutes per hour
      4;
    // Reload the tab (it sometimes freezes after >12 hours)
    const source = interval(period);
    source.subscribe(() => window.location.reload());
  }
}
