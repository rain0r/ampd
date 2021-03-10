import { Component, Input } from "@angular/core";

@Component({
  selector: "app-cover-cache",
  templateUrl: "./cover-cache.component.html",
  styleUrls: ["./cover-cache.component.scss"],
})
export class CoverCacheComponent {
  @Input() localCoverCache = false;
}
