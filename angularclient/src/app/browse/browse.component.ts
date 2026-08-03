import { AsyncPipe } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ActivatedRoute } from "@angular/router";
import { Observable, map, mergeMap } from "rxjs";
import { BrowseService } from "../service/browse.service";
import { AmpdBrowsePayload } from "../shared/model/browse-payload";
import { DirectoriesComponent } from "./directories/directories.component";
import { BrowseNavigationComponent } from "./navigation/browse-navigation.component";
import { PlaylistsComponent } from "./playlists/playlists.component";
import { TracksComponent } from "./tracks/tracks.component";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    BrowseNavigationComponent,
    PlaylistsComponent,
    DirectoriesComponent,
    TracksComponent,
    AsyncPipe,
    MatProgressSpinner,
  ],
})
export class BrowseComponent {
  private browseService = inject(BrowseService);
  private route = inject(ActivatedRoute);

  browsePayload$: Observable<AmpdBrowsePayload>;
  isLoading = this.browseService.isLoading;

  constructor() {
    const dir: Observable<string> = this.route.queryParamMap.pipe(
      map((params) =>
        params.has("dir") ? (params.get("dir") as string) : "/",
      ),
    );
    this.browsePayload$ = dir.pipe(
      mergeMap((d) => {
        return this.browseService.sendBrowseReq(d);
      }),
    );
  }
}
