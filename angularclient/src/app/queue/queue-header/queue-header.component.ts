import { Component } from "@angular/core";
import { combineLatest, map, Observable } from "rxjs";
import { MpdService } from "../../service/mpd.service";
import { QueueTrack } from "../../shared/model/queue-track";

interface CurrentPlay {
  state: string;
  track: QueueTrack;
}

@Component({
  selector: "app-queue-header",
  templateUrl: "./queue-header.component.html",
  styleUrls: ["./queue-header.component.scss"],
})
export class QueueHeaderComponent {
  currentPlay: Observable<CurrentPlay>;
  currentPathLink = ""; // encoded dir of the current playing track

  constructor(private mpdService: MpdService) {
    this.currentPlay = combineLatest([
      this.mpdService.currentState$,
      this.mpdService.currentTrack$,
    ]).pipe(
      map(([state, track]) => {
        return {
          state: state,
          track: track,
        } as CurrentPlay;
      })
    );
  }
}
