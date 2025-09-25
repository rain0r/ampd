import { Component, inject } from "@angular/core";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { Observable, Subject, of, startWith, switchMap } from "rxjs";
import { RecentlyListenedService } from "src/app/service/recently-listened.service";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { AsyncPipe } from "@angular/common";
import { AlbumItemComponent } from "../../albums/album-item/album-item.component";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: "app-recently-listened-albums",
  templateUrl: "./recently-listened-albums.component.html",
  styleUrl: "./recently-listened-albums.component.css",
  imports: [AlbumItemComponent, MatPaginator, MatProgressSpinner, AsyncPipe],
})
export class RecentlyListenedAlbumsComponent {
  private recentlyListenedService = inject(RecentlyListenedService);

  pagedAlbums$ = new Observable<PaginatedResponse<MpdAlbum>>();
  private message$ = new Subject<PageEvent>();

  constructor() {
    this.message$
      .pipe(
        startWith({ pageIndex: null, pageSize: null }),
        switchMap((pageEvent) => {
          return this.recentlyListenedService.getAlbums(pageEvent.pageIndex);
        }),
      )
      .subscribe((data) => (this.pagedAlbums$ = of(data)));
  }

  handlePage($event: PageEvent): void {
    this.message$.next($event);
    this.pagedAlbums$ = new Observable<PaginatedResponse<MpdAlbum>>();
  }
}
