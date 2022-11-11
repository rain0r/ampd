import { ViewportScroller } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { filter, map, Observable } from "rxjs";
import { NotificationService } from "src/app/service/notification.service";
import { QueueService } from "src/app/service/queue.service";
import { ResponsiveScreenService } from "src/app/service/responsive-screen.service";
import { QueueTrack } from "src/app/shared/model/queue-track";
import { FormField } from "src/app/shared/search/form-field";
import { ClickActions } from "src/app/shared/track-table-data/click-actions.enum";
import { TrackTableOptions } from "src/app/shared/track-table-data/track-table-options";
import { SearchService } from "../../service/search.service";

@Component({
  selector: "app-advanced-search",
  templateUrl: "./advanced-search.component.html",
  styleUrls: ["./advanced-search.component.scss"],
})
export class AdvancedSearchComponent implements OnInit {
  formFields: FormField[];
  form: FormGroup = <FormGroup>{};
  trackTableOptions$ = new Observable<TrackTableOptions>();

  constructor(
    private notificationService: NotificationService,
    private queueService: QueueService,
    private responsiveScreenService: ResponsiveScreenService,
    private scroller: ViewportScroller,
    private searchService: SearchService
  ) {
    this.formFields = this.getFormFields();
  }

  ngOnInit(): void {
    this.form = this.toFormGroup(this.formFields);
  }

  onSubmit(): void {
    const fd = <Record<string, string>>this.form.getRawValue();
    this.responsiveScreenService
      .isMobile()
      .subscribe((mobile) => this.sendSearchReq(fd, mobile));
  }

  onAddAll(): void {
    this.trackTableOptions$
      .pipe(
        map((opt) => opt.dataSource.data.map((queueTrack) => queueTrack.file))
      )
      .subscribe((opt) => {
        this.queueService.addTracks(opt);
        this.notificationService.popUp(`Added ${opt.length} tracks`);
      });
  }

  private sendSearchReq(fd: Record<string, string>, isMobile: boolean) {
    this.trackTableOptions$ = this.searchService.advSearch(fd).pipe(
      map((tracks) => {
        const trackTableOptions = new TrackTableOptions();
        trackTableOptions.dataSource = new MatTableDataSource<QueueTrack>(
          tracks
        );
        trackTableOptions.displayedColumns = this.getDisplayedColumns(isMobile);
        trackTableOptions.onPlayClick = ClickActions.AddPlayTrack;
        trackTableOptions.pagination = true;
        return trackTableOptions;
      })
    );
    this.trackTableOptions$
      .pipe(filter((data) => data.dataSource.data.length > 0))
      .subscribe(() => this.scroller.scrollToAnchor("results"));
  }

  private toFormGroup(inputs: FormField[]): FormGroup {
    type myFormGroupType = Record<string, AbstractControl>;
    const group: myFormGroupType = {};
    inputs.forEach((input) => {
      group[input.key] = new FormControl();
    });
    return new FormGroup(group);
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

  private getDisplayedColumns(isMobile: boolean): string[] {
    const displayedColumns = [
      { name: "position", showMobile: false },
      { name: "artistName", showMobile: true },
      { name: "albumName", showMobile: false },
      { name: "title", showMobile: true },
      { name: "length", showMobile: false },
      { name: "playTitle", showMobile: false },
      { name: "addTitle", showMobile: false },
    ];

    return displayedColumns
      .filter((cd) => !isMobile || cd.showMobile)
      .map((cd) => cd.name);
  }
}
