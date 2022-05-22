import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import {
  bufferTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { MpdAlbum } from "src/app/shared/models/http/album";
import { AlbumsService } from "src/app/shared/services/albums.service";

@Component({
  selector: "app-albums",
  templateUrl: "./albums.component.html",
  styleUrls: ["./albums.component.scss"],
})
export class AlbumsComponent implements OnInit {
  @ViewChild("filterInputElem") filterInputElem?: ElementRef;
  albums = new Observable<MpdAlbum[]>();
  filter = "";
  page = new Observable<number>();
  isLoading = new BehaviorSubject(true);
  // private inputSetter$ = new Subject<string>();
  private inputSetter$ = new BehaviorSubject<string>("");

  constructor(
    private albumService: AlbumsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildPageListener();
    this.buildInputListener();
    // this.loadData();
  }

  applyFilter(eventTarget: EventTarget | null): void {
    const inputValue = (<HTMLInputElement>eventTarget).value;
    if (inputValue) {
      this.inputSetter$.next(inputValue);
    } else {
      this.loadData();
      this.inputSetter$.next("");
    }
  }

  resetFilter(): void {
    this.filter = "";
    this.inputSetter$.next("");
  }

  private buildInputListener() {
    const searchInput = this.inputSetter$.asObservable().pipe(
      bufferTime(1500),
      distinctUntilChanged(),
      filter((times: string[]) => times.length > 0),
      map((input: string[]) => input[input.length - 1])
    );

    combineLatest([this.page, searchInput])
      .pipe(
        switchMap(([page, searchInput]) => {
          this.albums = new Observable<MpdAlbum[]>();
          this.isLoading.next(true);
          console.log(`Page: ${page}, searchInput: ${searchInput}`);
          return this.albumService.getAlbums(page, searchInput);
        }),
        tap((albums) => (this.albums = of(albums)))
      )
      .subscribe(() => this.isLoading.next(false));
  }

  private loadData(searchTerm = "") {
    this.page.subscribe((page) => {
      this.isLoading.next(true);
      console.log(`loadData() page: ${page}`);
      this.albums = this.albumService
        .getAlbums(page, searchTerm)
        .pipe(tap(() => this.isLoading.next(false)));
    });
  }

  private buildPageListener() {
    this.page = this.activatedRoute.queryParamMap.pipe(
      map((qp) => parseInt(qp.get("page") || "1")),
      distinctUntilChanged()
    );
  }
}
