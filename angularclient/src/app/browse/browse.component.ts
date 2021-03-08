import { Component } from "@angular/core";
import { BrowseService } from "../shared/services/browse.service";
import { ActivatedRoute } from "@angular/router";
import { AmpdBrowsePayload } from "../shared/models/ampd-browse-payload";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent {
  browsePayload: AmpdBrowsePayload;
  errorDetail = "";
  errorTitle = "";
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private browseService: BrowseService
  ) {
    this.browsePayload = browseService.buildEmptyPayload();

    // Read the query parameter identifying the current dir
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const dir = <string>queryParams.dir || "/";
      this.browseService.sendBrowseReq(dir).subscribe(
        (browsePayload) => (this.browsePayload = browsePayload),
        (err: HttpErrorResponse) => {
          this.errorTitle = `Got an error while browsing ${dir}`;
          this.errorDetail = err.message;
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    });
  }

  onBackToTop(): void {
    window.scrollTo(0, 0);
  }
}
