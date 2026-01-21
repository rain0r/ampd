import { SlicePipe } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { MatDivider } from "@angular/material/divider";
import { MatIcon } from "@angular/material/icon";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { PAGE_SIZE_OPTIONS } from "src/app/shared/page-size-options";
import { FilterService } from "../../service/msg.service";
import { Directory } from "../../shared/messages/incoming/directory";
import { DirectoryFilterStartLetterPipe } from "../../shared/pipes/filter/directory-filter-start-letter-pipe";
import { DirectoryFilterPipe } from "../../shared/pipes/filter/directory-filter.pipe";
import { Filterable } from "../filterable";
import { CoverGridComponent } from "./cover-grid/cover-grid.component";
import { DirectoryEntryComponent } from "./directory-entry/directory-entry.component";

@Component({
  selector: "app-directories",
  templateUrl: "./directories.component.html",
  styleUrls: ["./directories.component.scss"],
  imports: [
    MatIcon,
    MatDivider,
    DirectoryEntryComponent,
    MatPaginator,
    CoverGridComponent,
    SlicePipe,
    DirectoryFilterPipe,
    DirectoryFilterStartLetterPipe,
  ],
})
export class DirectoriesComponent extends Filterable implements OnInit {
  @Input() directories: Directory[] = [];
  @Input() dirQp = "/";

  dirQpLabel = "/";
  filterByStartCharValue = "";
  filterVisible = false;
  letters = new Set<string>();
  pageSizeOptions = PAGE_SIZE_OPTIONS;
  paginationFrom = 0;
  paginationTo = PAGE_SIZE_OPTIONS[0];

  constructor() {
    const filterService = inject(FilterService);
    super(filterService);
  }

  ngOnInit(): void {
    this.dirQpLabel = decodeURIComponent(this.dirQp);
    this.buildLetters();
  }

  public handlePage(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }

  toggleFilter(): void {
    this.filterVisible = !this.filterVisible;
  }

  setStartLetterFilter(letter: string): void {
    if (letter === "") {
      this.filterVisible = false;
    }
    this.filterByStartCharValue = letter.substring(0, 1).toUpperCase();
  }

  private buildLetters(): void {
    const letters = new Set<string>();
    this.directories.forEach((val) => {
      letters.add(val.path.substring(0, 1).toUpperCase());
    });
    this.letters = letters;
  }
}
