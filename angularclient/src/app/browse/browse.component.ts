import {Component} from "@angular/core";
import {BrowseInfo} from "../shared/models/browse-info";
import {BrowseService} from "../shared/services/browse.service";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent {
  browseInfo: BrowseInfo = new BrowseInfo();

  constructor(private browseService: BrowseService) {
    this.browseInfo = this.browseService.browseInfo;
  }

  onBackToTop(): void {
    window.scrollTo(0, 0);
  }
}
