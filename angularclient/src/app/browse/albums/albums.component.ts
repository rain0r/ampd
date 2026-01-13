import { AsyncPipe, ViewportScroller } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatOption } from "@angular/material/autocomplete";
import { MatIconButton } from "@angular/material/button";
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatSelect } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { map, startWith, tap } from "rxjs/operators";
import { AlbumsService } from "src/app/service/albums.service";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { BrowseNavigationComponent } from "../navigation/browse-navigation.component";
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
    MatOption,
    MatInput,
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
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  @ViewChild("filterInputElem") filterInputElem?: ElementRef;
  filter = "";
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
      this.activatedRoute.queryParamMap,
      sortBy,
      searchTerm,
    ]).subscribe(([queryParams, sortBy, searchTerm]) => {
      this.pagedAlbums$ = this.albumService.getAlbums(
        searchTerm,
        Number(queryParams.get("pageIndex")),
        sortBy,
      );
    });
  }

  handlePage($event: PageEvent): void {
    this.viewportScroller.scrollToAnchor("loading");

    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { pageIndex: $event.pageIndex },
      queryParamsHandling: "merge",
    });
  }
}
