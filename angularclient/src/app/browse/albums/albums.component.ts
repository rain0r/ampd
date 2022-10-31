import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { AlbumsService } from "src/app/service/albums.service";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { MpdAlbum } from "src/app/shared/model/http/album";
import { SettingKeys } from "src/app/shared/model/internal/frontend-settings";

interface SortByKey {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-albums",
  templateUrl: "./albums.component.html",
  styleUrls: ["./albums.component.scss"],
})
export class AlbumsComponent implements OnInit {
  @ViewChild("filterInputElem") filterInputElem?: ElementRef;
  albums = new Observable<MpdAlbum[]>();
  filter = "";
  sortBy = new Observable<string>();
  page = new Observable<number>();
  isLoading = new BehaviorSubject(true);
  sortByKeys: SortByKey[] = [
    { value: "artist", viewValue: "Artist" },
    { value: "album", viewValue: "Album" },
  ];
  gridColumns = 3;
  darkTheme: Observable<boolean>;
  private inputSetter$ = new BehaviorSubject<string>("");

  constructor(
    private albumService: AlbumsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private frontendSettingsService: FrontendSettingsService
  ) {
    this.darkTheme = this.frontendSettingsService.getBoolValue$(
      SettingKeys.DARK_THEME
    );
  }

  ngOnInit(): void {
    this.buildQueryParamListener();
    this.buildInputListener();
  }

  applyFilter(eventTarget: EventTarget | null): void {
    const inputValue = (<HTMLInputElement>eventTarget).value;
    if (inputValue) {
      this.inputSetter$.next(inputValue);
      void this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { search_term: encodeURIComponent(inputValue) },
        queryParamsHandling: "merge",
      });
    } else {
      this.inputSetter$.next("");
      this.resetFilter();
    }
  }

  resetFilter(): void {
    this.filter = "";
    this.inputSetter$.next("");
  }

  onSortBy($event: string): void {
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { sortBy: $event },
      queryParamsHandling: "merge",
    });
  }

  private buildInputListener() {
    const searchInput = this.inputSetter$.asObservable().pipe(
      bufferTime(1500),
      distinctUntilChanged(),
      filter((times: string[]) => times.length > 0),
      map((input: string[]) => input[input.length - 1])
    );

    combineLatest([this.page, searchInput, this.sortBy])
      .pipe(
        switchMap(([page, searchInput, sortBy]) => {
          this.albums = new Observable<MpdAlbum[]>();
          this.isLoading.next(true);
          return this.albumService.getAlbums(page, searchInput, sortBy);
        }),
        tap((albums) => (this.albums = of(albums)))
      )
      .subscribe(() => this.isLoading.next(false));
  }

  private buildQueryParamListener() {
    this.page = this.activatedRoute.queryParamMap.pipe(
      map((qp) => parseInt(qp.get("page") || "1")),
      distinctUntilChanged()
    );
    this.sortBy = this.activatedRoute.queryParamMap.pipe(
      map((qp) => qp.get("sortBy") || ""),
      distinctUntilChanged()
    );
  }
}
