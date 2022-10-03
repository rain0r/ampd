import { Component } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-help-dialog",
  templateUrl: "./help-dialog.component.html",
  styleUrls: ["./help-dialog.component.scss"],
})
export class HelpDialogComponent {
  isDarkTheme: Observable<boolean> = new Observable<boolean>();
  shortcuts = [
    // General
    new Map([["f", "Jump to the filter input field"]]),
    // Player controls
    new Map([
      ["p", "Play / Pause"],
      ["s", "Stop"],
      ["space", "Play / Pause"],
      ["←", "Previous song"],
      ["<", "Previous song"],
      ["→", "Next song"],
      [">", "Next song"],
      ["+", "Increase volume"],
      ["-", "Decrease volume"],
    ]),
    // Navigation
    new Map([
      ["1", "Navigate to queue view"],
      ["2", "Navigate to browse view"],
      ["3", "Navigate to search view"],
      ["4", "Navigate to settings view"],
    ]),
    new Map([
      // MPD mode
      ["R", "Toggle consume"],
      ["r", "Toggle repeat"],
      ["x", "Toggle crossfade"],
      ["y", "Toggle single"],
      ["z", "Toggle shuffle"],
    ]),
    new Map([
      // Queue
      ["C", "Clear queue"],
    ]),
    new Map([
      // General
      ["h", "Open help dialog"],
      ["S", "Open search dialog"],
    ]),
  ];
}
