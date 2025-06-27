import { ViewportScroller, NgFor, NgIf, AsyncPipe } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, combineLatest, of } from "rxjs";
import { filter, map, startWith, switchMap, tap } from "rxjs/operators";
import { AlbumsService } from "src/app/service/albums.service";
import { MsgService } from "src/app/service/msg.service";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import {
  InternMsgType,
  PaginationMsg,
} from "src/app/shared/messages/internal/internal-msg";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { BrowseNavigationComponent } from "../navigation/browse-navigation.component";
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from "@angular/material/form-field";
import { MatSelect } from "@angular/material/select";
import { FormsModule } from "@angular/forms";
import { MatOption } from "@angular/material/autocomplete";
import { MatInput } from "@angular/material/input";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { AlbumItemComponent } from "./album-item/album-item.component";

interface SortByKey {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-albums",
  templateUrl: "./albums.component.html",
  styleUrls: ["./albums.component.scss"],
  imports: [
    BrowseNavigationComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    NgFor,
    MatOption,
    MatInput,
    NgIf,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatProgressSpinner,
    AlbumItemComponent,
    MatPaginator,
    AsyncPipe,
  ],
})
export class AlbumsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private albumService = inject(AlbumsService);
  private msgService = inject(MsgService);
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  @ViewChild("filterInputElem") filterInputElem?: ElementRef;
  filter = "";
  isLoading = new BehaviorSubject(true);
  pagedAlbums$ = new Observable<PaginatedResponse<MpdAlbum>>();
  sortBy = "";
  searchTerm = "";
  sortByKeys: SortByKey[] = [
    { value: "artist", viewValue: "Artist" },
    { value: "album", viewValue: "Album" },
    { value: "random", viewValue: "Random" },
  ];

  private inputSetter$ = new BehaviorSubject<string>("");

  ngOnInit(): void {
    this.buildInputListener();
  }

  applyFilter(eventTarget: EventTarget | null): void {
    const inputValue = (eventTarget as HTMLInputElement).value;
    this.inputSetter$.next(inputValue);
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { searchTerm: inputValue },
      queryParamsHandling: "merge",
    });
  }

  resetFilter(): void {
    this.filter = "";
    this.inputSetter$.next("");
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
    });
  }

  onSortBy($event: string): void {
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { sortBy: $event },
      queryParamsHandling: "merge",
    });
  }

  private buildInputListener() {
    const pagination = this.msgService.message.pipe(
      filter((msg) => msg.type === InternMsgType.PaginationEvent),
      map((msg) => msg as PaginationMsg),
      map((msg) => msg.event),
    );
    const sortBy: Observable<string> = this.activatedRoute.queryParamMap.pipe(
      map((queryParamMap) => queryParamMap.get("sortBy") || ""),
      startWith(""),
      tap((sortBy) => (this.sortBy = sortBy)),
    );
    const searchTerm: Observable<string> =
      this.activatedRoute.queryParamMap.pipe(
        map((queryParamMap) => queryParamMap.get("searchTerm") || ""),
        startWith(""),
        tap((searchTerm) => (this.searchTerm = searchTerm)),
      );

    combineLatest([
      pagination.pipe(startWith({ pageIndex: null, pageSize: null })),
      sortBy,
      searchTerm,
    ])
      .pipe(
        switchMap(([pagination, sortBy, searchTerm]) => {
          this.isLoading.next(true);
          return this.albumService.getAlbums(
            searchTerm,
            pagination.pageIndex,
            sortBy,
          );
        }),
      )
      .subscribe((data) => {
        this.processSearchResults(data);
      });
  }

  processSearchResults(data: PaginatedResponse<MpdAlbum>): void {
    this.isLoading.next(false);
    this.pagedAlbums$ = of(data);
  }

  handlePage($event: PageEvent): void {
    this.viewportScroller.scrollToAnchor("loading");
    this.msgService.sendMessage({
      type: InternMsgType.PaginationEvent,
      event: $event,
    } as PaginationMsg);
    this.pagedAlbums$ = new Observable<PaginatedResponse<MpdAlbum>>();
  }
}
