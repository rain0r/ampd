import { Component } from "@angular/core";
import { MpdModesPanel } from "../../shared/messages/incoming/mpd-modes-panel";
import { MpdService } from "../../service/mpd.service";
import { MpdModeService } from "../../service/mpd-mode.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-mpd-modes",
  templateUrl: "./mpd-mode.component.html",
  styleUrls: ["./mpd-mode.component.scss"],
})
export class MpdModeComponent {
  mpdModesPanel: Observable<MpdModesPanel>;

  constructor(
    private mpdModeService: MpdModeService,
    private mpdService: MpdService
  ) {
    this.mpdModesPanel = this.mpdService.mpdModesPanel$;
  }

  toggleCtrl(key: string): void {
    this.mpdModeService.toggleCtrl(key);
  }
}
