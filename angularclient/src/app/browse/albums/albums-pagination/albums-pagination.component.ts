import { Component, Input } from "@angular/core";

@Component({
  selector: "app-albums-pagination",
  templateUrl: "./albums-pagination.component.html",
  styleUrls: ["./albums-pagination.component.scss"],
})
export class AlbumsPaginationComponent {
  @Input() pageNo = 1;
}
