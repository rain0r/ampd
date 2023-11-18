import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { distinctUntilChanged, finalize, map } from "rxjs/operators";
import { BrowseService } from "../service/browse.service";
import { AmpdBrowsePayload } from "../shared/model/ampd-browse-payload";

@Component({
  selector: "app-browse",
  templateUrl: "./browse.component.html",
  styleUrls: ["./browse.component.scss"],
})
export class BrowseComponent {
  browsePayload: Observable<AmpdBrowsePayload>;
  dirQp = "/";
  isLoading = true;
  private browsePayload$: BehaviorSubject<AmpdBrowsePayload>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private browseService: BrowseService,
  ) {
    this.browsePayload$ = new BehaviorSubject<AmpdBrowsePayload>(
      browseService.buildEmptyPayload(),
    );
    this.browsePayload = this.browsePayload$.asObservable();

    // Read the query parameter identifying the current dir
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => <string>qp.get("dir") || "/"),
        distinctUntilChanged(),
      )
      .subscribe((dir) => {
        // Turn the loading animation on
        this.isLoading = true;

        // Empty the browse info so to prevent displaying the former objects when browsing
        this.browsePayload$.next(browseService.buildEmptyPayload());

        this.dirQp = dir;

        this.browseService
          .sendBrowseReq(dir)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((browsePayload) =>
            this.browsePayload$.next(browsePayload),
          );
      });
  }
}
