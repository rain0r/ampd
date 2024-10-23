import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { RecentlyListenedService } from "src/app/service/recently-listened.service";
import { Track } from "src/app/shared/messages/incoming/track";

@Component({
  selector: "app-recently-listened-tracks",
  templateUrl: "./recently-listened-tracks.component.html",
  styleUrl: "./recently-listened-tracks.component.css",
})
export class RecentlyListenedTracksComponent {
  tracks$: Observable<Track[]>;

  constructor(private recentlyListenedService: RecentlyListenedService) {
    this.tracks$ = this.recentlyListenedService.getTracks();
  }
}
