import { Component } from "@angular/core";
import { Observable, startWith } from "rxjs";
import { MpdModeService } from "../../service/mpd-mode.service";
import { MpdService } from "../../service/mpd.service";
import { MpdModesPanel } from "../../shared/messages/incoming/mpd-modes-panel";

@Component({
  selector: "app-mpd-modes",
  templateUrl: "./mpd-mode.component.html",
  styleUrls: ["./mpd-mode.component.scss"],
  standalone: false,
})
export class MpdModeComponent {
  connected$: Observable<boolean>;
  mpdModesPanel: Observable<MpdModesPanel>;

  constructor(
    private mpdModeService: MpdModeService,
    private mpdService: MpdService,
  ) {
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
