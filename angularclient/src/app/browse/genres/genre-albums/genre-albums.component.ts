import { Component, Input } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { GenresPayload } from "src/app/shared/models/http/genres";

@Component({
  selector: "app-genre-albums",
  templateUrl: "./genre-albums.component.html",
  styleUrls: ["./genre-albums.component.scss"],
})
export class GenreAlbumsComponent {
  @Input() payload = <GenresPayload>{};
  paginationFrom = 0;
  paginationTo = 50;

  getPaginatorData(event: PageEvent): PageEvent {
    this.paginationFrom = event.pageIndex * event.pageSize;
    this.paginationTo = this.paginationFrom + event.pageSize;
    return event;
  }
}
