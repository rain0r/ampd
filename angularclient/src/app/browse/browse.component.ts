import { Component } from "@angular/core";
import { BrowseService } from "../shared/services/browse.service";
import { ActivatedRoute } from "@angular/router";
import { AmpdBrowsePayload } from "../shared/models/ampd-browse-payload";
import { BehaviorSubject, Observable } from "rxjs";
import { ErrorMsg } from "../shared/error/error-msg";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent {
  browsePayload: Observable<AmpdBrowsePayload>;
  error: ErrorMsg | null = null;
  isLoading = true;
  private browsePayload$: BehaviorSubject<AmpdBrowsePayload>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private browseService: BrowseService
  ) {
    this.browsePayload$ = new BehaviorSubject<AmpdBrowsePayload>(
      browseService.buildEmptyPayload()
    );
    this.browsePayload = this.browsePayload$.asObservable();

    // Read the query parameter identifying the current dir
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      // Turn the loading animation on
      this.isLoading = true;

      // Empty the browse info so to prevent displaying the former objects when browsing
      this.browsePayload$.next(browseService.buildEmptyPayload());

      const dir = <string>queryParams.dir || "/";
      this.browseService.sendBrowseReq(dir).subscribe(
        (browsePayload) => {
          this.browsePayload$.next(browsePayload);
        },
        (err: ErrorMsg) => {
          this.error = err;
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
