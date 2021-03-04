import { Component } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-help-dialog",
  templateUrl: "./help-modal.component.html",
  styleUrls: ["./help-modal.component.scss"],
})
export class HelpModalComponent {
  isDarkTheme: Observable<boolean> = new Observable<boolean>();
  shortcuts = [
    // General
    new Map([["f", "Jump to the filter input field"]]),
    // Player controls
    new Map([
      ["p", "Play / Pause"],
      ["←", "Previous song"],
      ["→", "Next song"],
    ]),
    // Navigation
    new Map([
      ["1", "Navigate to the queue view"],
      ["2", "Navigate to the browse view"],
      ["3", "Navigate to the search view"],
      ["4", "Navigate to the settings view"],
    ]),
    new Map([
      // MPD mode
      ["R", "Toggle consume"],
      ["r", "Toggle repeat"],
      ["x", "Toggle crossfade"],
      ["y", "Toggle single"],
      ["z", "Toggle shuffle"],
    ]),
  ];
}
