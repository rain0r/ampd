import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { map, Observable } from "rxjs";
import { RadioStreamService } from "../../service/radio-stream.service";
import { RadioStream } from "../../shared/model/db/radio-stream";

@Component({
  selector: "app-add-stream-dialog",
  templateUrl: "./add-stream-dialog.component.html",
  styleUrls: ["./add-stream-dialog.component.scss"],
})
export class AddStreamDialogComponent implements OnInit {
  dataSource$ = new Observable<MatTableDataSource<RadioStream>>();
  radioStreamForm = new FormGroup({
    // eslint-disable-next-line  @typescript-eslint/unbound-method
    name: new FormControl("", Validators.required),
    // eslint-disable-next-line  @typescript-eslint/unbound-method
    url: new FormControl("", Validators.required),
  });

  constructor(private radioService: RadioStreamService) {}

  ngOnInit(): void {
    this.loadData();
  }

  onSubmit(): void {
    this.radioService
      .addRadioStream({
        name: String(this.name.value),
        url: String(this.url.value),
      } as RadioStream)
      .subscribe(() => {
        this.radioStreamForm.reset();
        this.loadData();
      });
  }

  get name(): FormControl {
    return this.radioStreamForm.get("name") as FormControl;
  }

  get url(): FormControl {
    return this.radioStreamForm.get("url") as FormControl;
  }

  private loadData(): void {
    this.dataSource$ = this.radioService
      .getRadioStreams()
      .pipe(map((data) => new MatTableDataSource<RadioStream>(data)));
  }
}
