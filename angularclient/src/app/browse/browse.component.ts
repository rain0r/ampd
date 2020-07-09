import { Component } from "@angular/core";
import { BrowseInfo } from "../shared/models/browse-info";
import { BrowseService } from "../shared/services/browse.service";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent {
  browseInfo: BrowseInfo = new BrowseInfo();

  constructor(private browseService: BrowseService) {
    browseService.browseInfo.subscribe((info) => (this.browseInfo = info));
  }

  onBackToTop(): void {
    window.scrollTo(0, 0);
  }

  isLoading(): boolean {
    return (
      this.browseInfo.playlistQueue.length === 0 &&
      this.browseInfo.dirQueue.length === 0 &&
      this.browseInfo.trackQueue.length === 0
    );
  }
}
