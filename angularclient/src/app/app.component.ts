import { Component, OnInit } from "@angular/core";
import { interval } from "rxjs";
import { ThemingService } from "./service/theming.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  lightThemeEnabled;

  constructor(private ts: ThemingService) {
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
