import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { AlbumsService } from "src/app/service/albums.service";
import { FrontendSettingsService } from "src/app/service/frontend-settings.service";
import { MsgService } from "src/app/service/msg.service";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import {
  InternMsgType,
  PaginationMsg,
} from "src/app/shared/messages/internal/internal-msg";
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
  pagedAlbums$ = new Observable<PaginatedResponse<MpdAlbum>>();
  filter = "";
  selected = "";
  sortBy$ = new Observable<string>();
  isLoading = new BehaviorSubject(true);
  sortByKeys: SortByKey[] = [
    { value: "artist", viewValue: "Artist" },
    { value: "album", viewValue: "Album" },
    { value: "random", viewValue: "Random" },
  ];
  darkTheme: Observable<boolean>;
  private inputSetter$ = new BehaviorSubject<string>("");

  constructor(
    private activatedRoute: ActivatedRoute,
    private albumService: AlbumsService,
    private frontendSettingsService: FrontendSettingsService,
    private msgService: MsgService,
    private router: Router
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
        queryParams: { search_term: inputValue },
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

    combineLatest([
      this.msgService.message.pipe(
        filter((msg) => msg.type === InternMsgType.PaginationEvent),
        map((msg) => <PaginationMsg>msg),
        map((msg) => msg.event),
        startWith({ pageIndex: null, pageSize: null })
      ),
      searchInput,
      this.sortBy$.pipe(startWith(null)),
    ])
      .pipe(
        switchMap(([pagination, searchInput, sortBy]) => {
          this.isLoading.next(true);
          return this.albumService.getAlbums(
            searchInput,
            pagination.pageIndex,
            sortBy
          );
        })
      )
      .subscribe((data) => this.processSearchResults(data));
  }

  processSearchResults(data: PaginatedResponse<MpdAlbum>): void {
    this.isLoading.next(false);
    this.pagedAlbums$ = of(data);
  }

  handlePage($event: PageEvent): void {
    this.msgService.sendMessage({
      type: InternMsgType.PaginationEvent,
      event: $event,
    } as PaginationMsg);
  }

  private buildQueryParamListener() {
    this.sortBy$ = this.activatedRoute.queryParamMap.pipe(
      map((qp) => qp.get("sortBy") || ""),
      distinctUntilChanged()
    );
    this.sortBy$.subscribe((sort) => (this.selected = sort));
  }
}
