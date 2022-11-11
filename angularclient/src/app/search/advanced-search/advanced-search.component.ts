import { ViewportScroller } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import {
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
} from "rxjs";
import { NotificationService } from "src/app/service/notification.service";
import { QueueService } from "src/app/service/queue.service";
import { SearchService } from "src/app/service/search.service";
import { AdvSearchResponse } from "src/app/shared/model/http/adv-search-response";
import { QueueTrack } from "src/app/shared/model/queue-track";
import { FormField } from "src/app/shared/search/form-field";

@Component({
  selector: "app-advanced-search",
  templateUrl: "./advanced-search.component.html",
  styleUrls: ["./advanced-search.component.scss"],
})
export class AdvancedSearchComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );
  advSearchResponse: AdvSearchResponse = <AdvSearchResponse>{};
  advSearchResponse$ = new Observable<AdvSearchResponse>();
  displayedColumns: string[] = [
    "artistName",
    "albumName",
    "title",
    "playTitle",
    "addTitle",
  ];
  form: FormGroup = <FormGroup>{};
  formFields: FormField[];
  isLoadingResults = true;

  private formDataSubmitted = new Subject<Record<string, string>>();

  constructor(
    private notificationService: NotificationService,
    private queueService: QueueService,
    private scroller: ViewportScroller,
    private searchService: SearchService
  ) {
    this.advSearchResponse.content = [];
    this.formFields = this.getFormFields();
  }

  ngOnInit(): void {
    this.form = this.toFormGroup(this.formFields);
    this.isLoadingResults = false;
  }

  ngAfterViewInit(): void {
    combineLatest([
      this.formDataSubmitted,
      this.paginator.page.pipe(startWith({})),
    ])
      .pipe(
        switchMap(([fd]) => {
          this.isLoadingResults = true;
          return this.searchService.advSearch(fd, this.paginator.pageIndex);
        })
      )
      .subscribe((data) => {
        this.isLoadingResults = false;
        this.advSearchResponse = data;
        this.scroller.scrollToAnchor("results");
        this.advSearchResponse$ = of(data);
      });
  }

  onSubmit(): void {
    const fd = <Record<string, string>>this.form.getRawValue();
    this.formDataSubmitted.next(fd);
  }

  addPlayTrack(track: QueueTrack): void {
    this.queueService.addPlayQueueTrack(track);
  }

  onAddTrack(track: QueueTrack): void {
    this.queueService.addQueueTrack(track);
  }

  onAddAll(): void {
    this.advSearchResponse$
      .pipe(map((opt) => opt.content.map((queueTrack) => queueTrack.file)))
      .subscribe((opt) => {
        this.queueService.addTracks(opt);
        this.notificationService.popUp(`Added ${opt.length} tracks`);
      });
  }

  private getFormFields(): FormField[] {
    const inputs: FormField[] = [
      this.buildTextInput("album", "Album"),
      this.buildTextInput("albumartist", "Album Artist"),
      this.buildTextInput("artist", "Artist"),
      this.buildTextInput("title", "Title"),
      this.buildTextInput("track", "Track Number"),
      this.buildTextInput("genre", "Genre"),
      this.buildTextInput("date", "Date"),
      this.buildTextInput("composer", "Composer"),
      this.buildTextInput("performer", "Performer"),
      this.buildTextInput("comment", "Comment"),
      this.buildTextInput("disc", "Disc"),
      this.buildTextInput("filename", "File Name"),
    ];
    return inputs;
  }

  private buildTextInput(name: string, label: string) {
    return new FormField({
      controlType: "textbox",
      key: name,
      label: label,
      required: true,
    });
  }

  private toFormGroup(inputs: FormField[]): FormGroup {
    type myFormGroupType = Record<string, AbstractControl>;
    const group: myFormGroupType = {};
    inputs.forEach((input) => {
      group[input.key] = new FormControl();
    });
    return new FormGroup(group);
  }
}
