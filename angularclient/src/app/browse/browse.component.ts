import { Component } from "@angular/core";
import { BrowseService } from "../shared/services/browse.service";
import { ActivatedRoute } from "@angular/router";
import { AmpdBrowsePayload } from "../shared/models/ampd-browse-payload";
import { BehaviorSubject, Observable } from "rxjs";
import { ErrorMsg } from "../shared/error/error-msg";
import { distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent {
  browsePayload: Observable<AmpdBrowsePayload>;
  error: ErrorMsg | null = null;
  isLoading = true;
  dirQp = "/";
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
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => <string>qp.get("dir") || "/"),
        distinctUntilChanged()
      )
      .subscribe((dir) => {
        // Turn the loading animation on
        this.isLoading = true;

        // Empty the browse info so to prevent displaying the former objects when browsing
        this.browsePayload$.next(browseService.buildEmptyPayload());

        this.dirQp = dir;

        this.browseService.sendBrowseReq(dir).subscribe({
          next:(browsePayload) => {
            this.browsePayload$.next(browsePayload);
          },
          error:(err: ErrorMsg) => {
            this.error = err;
            this.isLoading = false;
          },
          complete:() => (this.isLoading = false)
        });
      });
  }

  onBackToTop(): void {
    window.scrollTo(0, 0);
  }
}
