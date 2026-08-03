import { AsyncPipe } from "@angular/common";
import {
  Component,
  DestroyRef,
  inject,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { Observable, Subject, of, startWith, switchMap } from "rxjs";
import { RecentlyListenedService } from "../../../service/recently-listened.service";
import { PaginatedResponse } from "../../../shared/messages/incoming/paginated-response";
import { MpdAlbum } from "../../../shared/model/http/album";
import { AlbumItemComponent } from "../../albums/album-item/album-item.component";

@Component({
  selector: "app-recently-listened-albums",
  templateUrl: "./recently-listened-albums.component.html",
  styleUrl: "./recently-listened-albums.component.css",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AlbumItemComponent, MatPaginator, MatProgressSpinner, AsyncPipe],
})
export class RecentlyListenedAlbumsComponent {
  private destroyRef = inject(DestroyRef);
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
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => (this.pagedAlbums$ = of(data)));
  }

  handlePage($event: PageEvent): void {
    this.message$.next($event);
    this.pagedAlbums$ = new Observable<PaginatedResponse<MpdAlbum>>();
  }
}
