import { Component } from "@angular/core";
import { BrowseInfo } from "../shared/models/browse-info";
import { BrowseService } from "../shared/services/browse.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent {
  browseInfo: BrowseInfo = new BrowseInfo();
  isLoading: boolean;

  constructor(private browseService: BrowseService) {
    browseService.browseInfo.subscribe((info) => (this.browseInfo = info));
    browseService.browseInfo
      .pipe(map((browseInfo) => browseInfo.isEmpty()))
      .subscribe((empty) => (this.isLoading = empty));
  }

  onBackToTop(): void {
    window.scrollTo(0, 0);
  }
}
