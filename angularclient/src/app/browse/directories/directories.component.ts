import { Component, Input, OnInit } from "@angular/core";
import { MessageService } from "../../shared/services/message.service";
import { Filterable } from "../filterable";
import { Observable } from "rxjs";
import { Directory } from "../../shared/messages/incoming/directory";
import { PageEvent } from "@angular/material/paginator";
import { FrontendSettingsService } from "../../shared/services/frontend-settings.service";

@Component({
  selector: "app-directories",
  templateUrl: "./directories.component.html",
  styleUrls: ["./directories.component.scss"],
})
export class DirectoriesComponent extends Filterable implements OnInit {
  @Input() directories: Directory[] = [];
  @Input() dirQp = "/";

  dirQpLabel = "/";
  filterByStartCharValue = "";
  filterVisible = false;
  letters = new Set<string>();
  pageSizeOptions: number[];
  pagination: Observable<boolean>;
  paginationFrom = 0;
  paginationTo: number;
  virtualScroll: Observable<boolean>;

  constructor(
    private frontendSettingsService: FrontendSettingsService,
    private messageService: MessageService
  ) {
    super(messageService);
    this.pageSizeOptions = this.frontendSettingsService.pageSizeOptions;
    this.paginationTo = this.frontendSettingsService.paginationTo;
    this.pagination = this.frontendSettingsService.pagination;
    this.virtualScroll = this.frontendSettingsService.virtualScroll;
  }

  ngOnInit(): void {
    this.dirQpLabel = decodeURIComponent(this.dirQp);
    this.buildLetters();
  }

  // used to build an array of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
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
    this.filterByStartCharValue = letter.substr(0, 1).toUpperCase();
  }

  private buildLetters(): void {
    const letters = new Set<string>();
    this.directories.forEach((val) => {
      letters.add(val.path.substr(0, 1).toUpperCase());
    });
    this.letters = letters;
  }
}
