import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RadioStreamService } from "../../../service/radio-stream.service";
import { RadioStream } from "../../../shared/model/db/radio-stream";

@Component({
  selector: "app-add-radio-stream",
  templateUrl: "./add-radio-stream.component.html",
  styleUrls: ["./add-radio-stream.component.scss"],
})
export class AddStreamComponent {
  radioStreamForm = new FormGroup({
    // eslint-disable-next-line  @typescript-eslint/unbound-method
    name: new FormControl("", Validators.required),
    // eslint-disable-next-line  @typescript-eslint/unbound-method
    url: new FormControl("", Validators.required),
  });

  constructor(private radioService: RadioStreamService) {}

  onSubmit(): void {
    this.radioService
      .addRadioStream({
        name: String(this.name.value),
        url: String(this.url.value),
      } as RadioStream)
      .subscribe(() => {
        this.radioStreamForm.reset();
        window.location.reload();
      });
  }

  get name(): FormControl {
    return this.radioStreamForm.get("name") as FormControl;
  }

  get url(): FormControl {
    return this.radioStreamForm.get("url") as FormControl;
  }
}
