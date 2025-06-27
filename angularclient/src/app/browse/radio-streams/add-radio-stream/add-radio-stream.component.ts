import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { RadioStreamService } from "../../../service/radio-stream.service";
import { RadioStream } from "../../../shared/model/db/radio-stream";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-add-radio-stream",
  templateUrl: "./add-radio-stream.component.html",
  styleUrls: ["./add-radio-stream.component.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
  ],
})
export class AddStreamComponent {
  private radioStreamService = inject(RadioStreamService);

  radioStreamForm = new FormGroup({
    name: new FormControl("", Validators.required),

    url: new FormControl("", Validators.required),
  });

  onSubmit(): void {
    this.radioStreamService
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
