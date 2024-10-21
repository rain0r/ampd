import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { RecentlyListenedService } from "src/app/service/recently-listened.service";
import { MpdAlbum } from "src/app/shared/model/http/album";

@Component({
  selector: "app-recently-listened",
  templateUrl: "./recently-listened.component.html",
  styleUrl: "./recently-listened.component.css",
})
export class RecentlyListenedComponent {
  albums$: Observable<MpdAlbum[]>;

  constructor(private recentlyListenedService: RecentlyListenedService) {
    this.albums$ = this.recentlyListenedService.getAlbums();
  }
}
