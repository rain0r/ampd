import { ViewportScroller } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private albumService: AlbumsService,
    private msgService: MsgService,
    private router: Router,
    private viewportScroller: ViewportScroller,
  ) {}

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
