import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { distinctUntilChanged, map, tap } from "rxjs/operators";
import { MpdAlbum } from "src/app/shared/models/http/album";
import { AlbumsService } from "src/app/shared/services/albums.service";

@Component({
  selector: "app-albums",
  templateUrl: "./albums.component.html",
  styleUrls: ["./albums.component.scss"],
})
export class AlbumsComponent {
  albums: Observable<MpdAlbum[]> | null = null;
  page: Observable<number>;

  constructor(
    private albumService: AlbumsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.page = this.activatedRoute.queryParamMap.pipe(
      map((qp) => parseInt(qp.get("page") || "1")),
      distinctUntilChanged(),
      tap((page) => (this.albums = this.albumService.getAlbums(page)))
    );
  }
}
