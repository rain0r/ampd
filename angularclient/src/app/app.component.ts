import { Component, OnInit } from "@angular/core";
// RxJS v6+
import { interval } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const period =
      4 * // hours
      60 * // minutes
      1000; // miliseconds

    // Reload the tab (it sometimes freezes after >12 hours)
    const source = interval(period);
    source.subscribe(() => window.location.reload());
  }
}
