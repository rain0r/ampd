import { AsyncPipe } from "@angular/common";
import { AfterViewInit, Component, inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { ActivatedRoute } from "@angular/router";
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subject,
  switchMap,
} from "rxjs";
import { QueueService } from "src/app/service/queue.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { SearchService } from "src/app/service/search.service";
import { PaginatedResponse } from "src/app/shared/messages/incoming/paginated-response";
import { Track } from "src/app/shared/messages/incoming/track";
import { QueueTrack } from "src/app/shared/model/queue-track";
import { FormField } from "src/app/shared/search/form-field";
import { ClickActions } from "src/app/shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "src/app/shared/track-table-data/track-table-options";
import { TrackTableDataComponent } from "../../shared/track-table-data/track-table-data.component";
import { DynamicFormInputComponent } from "./dynamic-form-input/dynamic-form-input.component";

@Component({
  selector: "app-advanced-search",
  templateUrl: "./advanced-search.component.html",
  styleUrls: ["./advanced-search.component.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DynamicFormInputComponent,
    MatButton,
    MatIcon,
    TrackTableDataComponent,
    AsyncPipe,
  ],
})
export class AdvancedSearchComponent implements OnInit, AfterViewInit {
  private activatedRoute = inject(ActivatedRoute);
  private queueService = inject(QueueService);
  private responsiveScreenService = inject(ResponsiveScreenService);
  private searchService = inject(SearchService);

  advSearchResponse$ = new Observable<PaginatedResponse<Track>>();
  displayedColumns: string[] = [
    "artistName",
    "albumName",
    "title",
    "play-title",
    "add-title",
  ];
  form: FormGroup = {} as FormGroup;
  formFields: FormField[];
  isLoadingResults = new BehaviorSubject(true);
  trackTableData = new TrackTableOptions();

  private searchParams: Record<string, string> = {};
  private formDataSubmitted = new Subject<Record<string, string>>();
  private isMobile = false;

  constructor() {
    this.formFields = this.getFormFields();
    this.responsiveScreenService
      .isMobile()
      .subscribe((isMobile) => (this.isMobile = isMobile));
    this.displayedColumns = this.getDisplayedColumns();
  }

  ngOnInit(): void {
    this.form = this.toFormGroup(this.formFields);
    this.isLoadingResults.next(false);
  }

  ngAfterViewInit(): void {
    combineLatest([this.formDataSubmitted, this.activatedRoute.queryParamMap])
      .pipe(
        switchMap(([fd, queryParams]) => {
          this.isLoadingResults.next(true);
          this.searchParams = fd;
          return this.searchService.advSearch(
            fd,
            Number(queryParams.get("pageIndex")),
            Number(queryParams.get("pageSize")),
          );
        }),
      )
      .subscribe((data) => this.processSearchResults(data));
  }

  onSubmit(): void {
    const fd = this.form.getRawValue() as Record<string, string>;
    this.formDataSubmitted.next(fd);
  }

  addPlayTrack(track: QueueTrack): void {
    this.queueService.addPlayQueueTrack(track);
  }

  onAddTrack(track: QueueTrack): void {
    this.queueService.addQueueTrack(track);
  }

  onAddAll(): void {
    this.searchService.addAll(this.searchParams).subscribe(() => void 0);
  }

  private processSearchResults(
    advSearchResponse: PaginatedResponse<Track>,
  ): void {
    this.isLoadingResults.next(false);
    this.advSearchResponse$ = of(advSearchResponse);
    this.trackTableData = this.buildTableData(advSearchResponse);
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

  private buildTableData(
    advSearchResponse: PaginatedResponse<Track>,
  ): TrackTableOptions {
    const trackTable = new TrackTableOptions({
      displayedColumns: this.getDisplayedColumns(),
      onPlayClick: ClickActions.AddPlayTrack,
      totalElements: advSearchResponse.totalElements,
      totalPages: advSearchResponse.totalPages,
      pageIndex: advSearchResponse.number,
    });
    trackTable.addTracks(advSearchResponse.content);
    return trackTable;
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

  private getDisplayedColumns(): string[] {
    const displayedColumns = [
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "play-title", showMobile: true },
      { name: "add-title", showMobile: true },
    ];
    return displayedColumns
      .filter((cd) => !this.isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
