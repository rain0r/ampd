import { Injectable } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root',
})
export class AmpdBlockUiService {
  public readonly LOADING_MSG = 'Connecting to MPD server...';
  public readonly BLOCK_TIMEOUT = 10 * 1000;

  @BlockUI() public blockUI?: NgBlockUI;

  constructor() {}

  public start(): void {
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

  public stop(): void {
    if (!this.blockUI) {
      return;
    }
    this.blockUI.unsubscribe();
  }
}
