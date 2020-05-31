import { Injectable } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Injectable({
  providedIn: "root",
})
export class AmpdBlockUiService {
  readonly LOADING_MSG = "Connecting to MPD server...";
  readonly BLOCK_TIMEOUT = 10 * 1000;

  @BlockUI() blockUI?: NgBlockUI;

  start(): void {
    if (!this.blockUI) {
      return;
    }
    this.blockUI.start(this.LOADING_MSG);
    setTimeout(() => {
      if (this.blockUI) {
        this.blockUI.stop(); // Stop blocking
      }
    }, this.BLOCK_TIMEOUT);
  }

  stop(): void {
    if (!this.blockUI) {
      return;
    }
    this.blockUI.unsubscribe();
  }
}
