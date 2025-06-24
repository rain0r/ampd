import { Component, inject } from "@angular/core";
import { Observable, startWith } from "rxjs";
import { MpdModeService } from "../../service/mpd-mode.service";
import { MpdService } from "../../service/mpd.service";
import { MpdModesPanel } from "../../shared/messages/incoming/mpd-modes-panel";
import { NgIf, AsyncPipe } from "@angular/common";
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from "@angular/material/button-toggle";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-mpd-modes",
  templateUrl: "./mpd-mode.component.html",
  styleUrls: ["./mpd-mode.component.scss"],
  imports: [NgIf, MatButtonToggleGroup, MatButtonToggle, MatIcon, AsyncPipe],
})
export class MpdModeComponent {
  private mpdModeService = inject(MpdModeService);
  private mpdService = inject(MpdService);

  connected$: Observable<boolean>;
  mpdModesPanel: Observable<MpdModesPanel>;

  constructor() {
    this.connected$ = this.mpdService.isConnected$();
    this.mpdModesPanel = this.mpdService.mpdModesPanel$.pipe(
      startWith({
        consume: false,
        crossfade: false,
        random: false,
        repeat: false,
        single: false,
      } as MpdModesPanel),
    );
  }

  toggleCtrl(key: string): void {
    this.mpdModeService.toggleCtrl(key);
  }
}
