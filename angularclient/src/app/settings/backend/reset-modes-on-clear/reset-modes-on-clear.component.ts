import { Component, Input } from "@angular/core";

@Component({
  selector: "app-reset-modes-on-clear",
  templateUrl: "./reset-modes-on-clear.component.html",
  styleUrls: ["./reset-modes-on-clear.component.scss"],
})
export class ResetModesOnClearComponent {
  @Input() resetModesOnClear = false;
}
