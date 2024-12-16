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
  standalone: false,
})
export class BrowseComponent {
  browsePayload$: Observable<AmpdBrowsePayload>;
  dirQp = "/";
  isLoading = true;
  private browsePayloadSource: BehaviorSubject<AmpdBrowsePayload>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private browseService: BrowseService,
  ) {
    this.browsePayloadSource = new BehaviorSubject<AmpdBrowsePayload>(
      browseService.buildEmptyPayload(),
    );
    this.browsePayload$ = this.browsePayloadSource.asObservable();

    // Read the query parameter identifying the current dir
    this.activatedRoute.queryParamMap
      .pipe(
        map((qp) => (qp.get("dir") as string) || "/"),
        distinctUntilChanged(),
      )
      .subscribe((dir) => {
        // Turn the loading animation on
        this.isLoading = true;

        // Empty the browse info so to prevent displaying the former objects when browsing
        this.browsePayloadSource.next(browseService.buildEmptyPayload());

        this.dirQp = dir;

        this.browseService
          .sendBrowseReq(dir)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((browsePayload) =>
            this.browsePayloadSource.next(browsePayload),
          );
      });
  }
}
